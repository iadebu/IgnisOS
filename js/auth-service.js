/**
 * CaliDevs Auth Service
 * Módulo centralizado de autenticación para todas las aplicaciones
 * Utiliza Firebase Authentication
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase Configuration - CaliDevs
const firebaseConfig = {
    apiKey: "AIzaSyDYu8pGr9ceS4vLxCKm2i_QwXaMu-Eq0dU",
    authDomain: "note-taker-ai-8bc38.firebaseapp.com",
    projectId: "note-taker-ai-8bc38",
    storageBucket: "note-taker-ai-8bc38.firebasestorage.app",
    messagingSenderId: "491247346612",
    appId: "1:491247346612:web:848d99e0f9331b897408e1",
    measurementId: "G-K0N0PNGSQD"
};

// Initialize Firebase (singleton pattern)
let app, auth, db;

function initFirebase() {
    if (!app) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    }
    return { app, auth, db };
}

// Initialize on load
const firebase = initFirebase();

/**
 * CaliDevs Auth Service Class
 */
class CaliDevsAuth {
    constructor() {
        this.currentUser = null;
        this.userProfile = null;
        this.authStateListeners = [];
        this.isInitialized = false;
        
        // Listen for auth state changes
        onAuthStateChanged(firebase.auth, async (user) => {
            this.currentUser = user;
            
            if (user) {
                // Load user profile from Firestore
                await this.loadUserProfile(user.uid);
            } else {
                this.userProfile = null;
            }
            
            this.isInitialized = true;
            
            // Notify all listeners
            this.authStateListeners.forEach(callback => {
                callback(user, this.userProfile);
            });
        });
    }

    /**
     * Wait for auth initialization
     */
    waitForInit() {
        return new Promise((resolve) => {
            if (this.isInitialized) {
                resolve(this.currentUser);
            } else {
                const checkInit = setInterval(() => {
                    if (this.isInitialized) {
                        clearInterval(checkInit);
                        resolve(this.currentUser);
                    }
                }, 100);
            }
        });
    }

    /**
     * Register a new user
     */
    async register(email, password, displayName = '') {
        try {
            const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password);
            const user = userCredential.user;

            // Update display name if provided
            if (displayName) {
                await updateProfile(user, { displayName });
            }

            // Create user profile in Firestore
            await this.createUserProfile(user.uid, {
                email: user.email,
                displayName: displayName || email.split('@')[0],
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                apps: {
                    noteTakerAI: { enabled: true, lastAccess: null },
                    // Add more apps here as they're created
                }
            });

            return { success: true, user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    /**
     * Sign in existing user
     */
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(firebase.auth, email, password);
            
            // Update last login
            await this.updateLastLogin(userCredential.user.uid);
            
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    /**
     * Sign out user
     */
    async logout() {
        try {
            await signOut(firebase.auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Create user profile in Firestore
     */
    async createUserProfile(uid, profileData) {
        try {
            await setDoc(doc(firebase.db, 'users', uid), profileData);
            this.userProfile = profileData;
        } catch (error) {
            console.error('Error creating user profile:', error);
        }
    }

    /**
     * Load user profile from Firestore
     */
    async loadUserProfile(uid) {
        try {
            const docSnap = await getDoc(doc(firebase.db, 'users', uid));
            if (docSnap.exists()) {
                this.userProfile = docSnap.data();
            } else {
                // Create profile if doesn't exist (for existing users)
                await this.createUserProfile(uid, {
                    email: this.currentUser.email,
                    displayName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                    apps: {
                        noteTakerAI: { enabled: true, lastAccess: null }
                    }
                });
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    /**
     * Update last login timestamp
     */
    async updateLastLogin(uid) {
        try {
            await updateDoc(doc(firebase.db, 'users', uid), {
                lastLogin: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating last login:', error);
        }
    }

    /**
     * Update app access timestamp
     */
    async updateAppAccess(appId) {
        if (!this.currentUser) return;
        
        try {
            await updateDoc(doc(firebase.db, 'users', this.currentUser.uid), {
                [`apps.${appId}.lastAccess`]: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating app access:', error);
        }
    }

    /**
     * Check if user has access to an app
     */
    hasAppAccess(appId) {
        if (!this.userProfile || !this.userProfile.apps) return false;
        return this.userProfile.apps[appId]?.enabled === true;
    }

    /**
     * Add auth state listener
     */
    onAuthStateChange(callback) {
        this.authStateListeners.push(callback);
        
        // If already initialized, call immediately
        if (this.isInitialized) {
            callback(this.currentUser, this.userProfile);
        }
        
        // Return unsubscribe function
        return () => {
            this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Get user-friendly error message
     */
    getErrorMessage(code) {
        const messages = {
            'auth/email-already-in-use': 'Este email ya está registrado',
            'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
            'auth/invalid-email': 'Email inválido',
            'auth/user-not-found': 'Usuario no encontrado',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/invalid-credential': 'Credenciales inválidas',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
            'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
        };
        return messages[code] || 'Error de autenticación';
    }

    /**
     * Get current user
     */
    getUser() {
        return this.currentUser;
    }

    /**
     * Get user profile
     */
    getProfile() {
        return this.userProfile;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.currentUser;
    }

    /**
     * Get Firebase instances for direct access
     */
    getFirebase() {
        return firebase;
    }
}

// Export singleton instance
const caliDevsAuth = new CaliDevsAuth();
export default caliDevsAuth;
export { firebase, CaliDevsAuth };
