"use client"
import React, { useRef, useState, useEffect } from 'react'
import { useWavesurfer } from '@wavesurfer/react'
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js'

export default function Aaaa() {
  const containerRef = useRef(null)
  const [recordPlugin, setRecordPlugin] = useState<RecordPlugin>()
  const [isRecording, setIsRecording] = useState(false)

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    waveColor: '#ff4e00',
    progressColor: '#dd5e98',
    plugins: React.useMemo(() => [RecordPlugin.create()], []), // Initialize plugin
  })

  useEffect(() => {
    if (wavesurfer) {
      // Access the plugin instance from wavesurfer
      const record = wavesurfer.getActivePlugins().find((p) => p instanceof RecordPlugin)
      setRecordPlugin(record)

      // Optional: Listen for when recording stops to get the audio blob
      record.on('record-end', (blob) => {
        const audioUrl = URL.createObjectURL(blob)
        console.log('Recording finished:', audioUrl)
      })
    }
  }, [wavesurfer])

  const toggleRecording = () => {
    if (isRecording) {
      recordPlugin.stopRecording()
    } else {
      recordPlugin.startRecording()
    }
    setIsRecording(!isRecording)
  }

  return (
    <div>
      <div ref={containerRef} style={{ minHeight: '128px' }} />
      <button onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  )
}