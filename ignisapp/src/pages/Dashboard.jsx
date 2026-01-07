import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { StatCard, QuickAction } from '../components/ui/Card'
import { useTasksStore } from '../store/tasksStore'
import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { tasks } = useTasksStore()

  const activeTasks = tasks.filter(t => !t.completed).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Hola, <span className="text-orange-500">{user?.displayName || 'Usuario'}</span>
        </h1>
        <p className="text-white/50">Bienvenido a IgnisOS. Aquí tienes un resumen de tu actividad.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📋" value={activeTasks} label="Tareas Pendientes" color="orange" />
        <StatCard icon="✅" value="0" label="Proyectos QC" color="green" />
        <StatCard icon="👥" value="0" label="Clientes" color="blue" />
        <StatCard icon="🔥" value="4" label="Módulos Activos" color="purple" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>⚡</span> Acciones Rápidas
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction
            icon="🎤"
            title="Capturar Nota"
            description="Graba o escribe"
            onClick={() => navigate('/torch')}
          />
          <QuickAction
            icon="📁"
            title="Nuevo Proyecto QC"
            description="Control de calidad"
            onClick={() => navigate('/quality')}
          />
          <QuickAction
            icon="👤"
            title="Agregar Cliente"
            description="Nuevo contacto"
            onClick={() => navigate('/crm')}
          />
          <QuickAction
            icon="🔤"
            title="Font Mixer"
            description="Combinar tipografías"
            onClick={() => navigate('/fonts')}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📈</span> Actividad Reciente
        </h2>
        <div className="glass rounded-2xl divide-y divide-white/5">
          <div className="flex items-center gap-4 p-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
              🔥
            </div>
            <div>
              <p className="font-medium">Bienvenido a IgnisOS</p>
              <p className="text-sm text-white/40">Ahora</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
