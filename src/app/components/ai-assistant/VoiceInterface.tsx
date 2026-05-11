import { ArrowLeft, Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { motion } from 'motion/react';

export function VoiceInterface() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="size-full bg-gradient-to-br from-primary via-primary to-secondary flex flex-col">
      <div className="px-6 py-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/10 backdrop-blur hover:bg-white/20 transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl text-white mb-2">
            Voice Assistant
          </h1>
          <p className="text-white/80">
            {isListening ? 'Listening...' : 'Tap to speak'}
          </p>
        </div>

        <div className="relative mb-12">
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-white/10 blur-xl"
            />
          )}
          <motion.button
            onClick={() => setIsListening(!isListening)}
            whileTap={{ scale: 0.95 }}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all shadow-2xl ${
              isListening
                ? 'bg-red-500'
                : 'bg-white/20 backdrop-blur'
            }`}
          >
            {isListening ? (
              <MicOff className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </motion.button>
        </div>

        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur rounded-2xl p-6 max-w-md w-full"
          >
            <p className="text-white text-center">
              "What does my health summary say?"
            </p>
          </motion.div>
        )}

        {!isListening && (
          <div className="space-y-3 w-full max-w-md">
            <h3 className="text-white/80 text-sm text-center mb-4">Try asking:</h3>
            {[
              'How is my health today?',
              'What are my medication reminders?',
              'Show me my risk analysis',
              'Find nearby hospitals',
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-full py-3 px-4 rounded-xl bg-white/10 backdrop-blur text-white text-sm hover:bg-white/20 transition-colors"
              >
                "{suggestion}"
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-8">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
          <p className="text-white/90 text-sm text-center">
            Your voice data is processed securely and never stored
          </p>
        </div>
      </div>
    </div>
  );
}
