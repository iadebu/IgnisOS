import { motion } from 'framer-motion'
import { Card } from '../components/ui/Card'

export default function CRM() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span className="text-blue-500">👥</span> CRM
        </h1>
        <p className="text-white/50">Gestiona tus clientes y sus proyectos</p>
      </div>

      <Card className="text-center py-12">
        <div className="text-5xl mb-4">🚧</div>
        <h3 className="text-xl font-bold mb-2">Módulo en desarrollo</h3>
        <p className="text-white/50">Pronto disponible en la nueva versión</p>
      </Card>
    </motion.div>
  )
}
