import { motion } from 'framer-motion'
import { CheckCircle2, Construction } from 'lucide-react'
import { Card } from '../components/ui/Card'

export default function QualityControl() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
          Control de Calidad
        </h1>
        <p className="text-white/50">Gestiona la calidad de tus proyectos web</p>
      </div>

      <Card className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
          <Construction className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">Módulo en desarrollo</h3>
        <p className="text-white/50">Pronto disponible en la nueva versión</p>
      </Card>
    </motion.div>
  )
}
