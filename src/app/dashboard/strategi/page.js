"use client";

import { useState, useRef } from 'react';
import { useTTS } from '@/hooks/useTTS';
import { Card, Button, Input } from '@/components/ui';
import { Keyboard, Mic, MessageSquare, Monitor, Play } from 'lucide-react';
import LessonChat from '@/components/ui/LessonChat';

const TABS = [
  { id: 'keyboard', label: 'Pintasan Keyboard', icon: Keyboard },
  { id: 'reader', label: 'Screen Reader', icon: Monitor },
  { id: 'voice', label: 'Catatan Suara', icon: Mic },
  { id: 'forum', label: 'Forum', icon: MessageSquare }
];

export default function Strategy() {
  const [activeTab, setActiveTab] = useState('keyboard');
  const [noteTitle, setNoteTitle] = useState('');
  const [recording, setRecording] = useState(false);
  const [records, setRecords] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const { speak } = useTTS();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const title = noteTitle || `Catatan ${records.length + 1}`;
        setRecords(prev => [{ title, url, date: new Date().toLocaleString() }, ...prev]);
        setNoteTitle('');
        speak(`Catatan ${title} berhasil disimpan.`);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setRecording(true);
      speak('Mulai merekam.');
    } catch {
      speak('Tidak dapat mengakses mikrofon.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-48px)]">
      <div className="w-full md:w-80 border-r border-zinc-200 bg-zinc-50/50 py-8">
        <h2 className="text-xs font-semibold px-8 pb-4 text-zinc-500 uppercase tracking-wider">
          Menu Strategi
        </h2>
        <div className="flex flex-col">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); }}
                className={`flex items-center gap-3 px-8 py-4 text-left transition-colors border-l-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-changeling ${isActive ? 'bg-bunny/60 border-l-changeling text-zinc-900' : 'border-l-transparent text-zinc-600 hover:bg-bunny/30'}`}
                aria-label={`Tab ${tab.label}`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-8 md:p-12 lg:p-16">
        <div className="max-w-3xl">
          {activeTab === 'keyboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-8">Pintasan Keyboard</h1>
              <Card>
                <div className="flex flex-col gap-4">
                  {[
                    ['F2', 'Bacakan halaman saat ini'],
                    ['Escape', 'Hentikan pembacaan teks'],
                    ['Tab', 'Pindah antar elemen'],
                    ['Enter / Space', 'Aktifkan elemen fokus']
                  ].map(([key, desc], i, arr) => (
                    <div key={key} className={`flex justify-between pb-4 ${i !== arr.length - 1 ? 'border-b border-zinc-100' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-sm px-2 py-1`} tabIndex={0} aria-label={`Tombol ${key}: ${desc}`}>
                      <span className="font-semibold text-zinc-900">{key}</span>
                      <span className="text-sm text-zinc-500">{desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'reader' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-8">Panduan Screen Reader</h1>
              <Card>
                <div className="flex flex-col gap-8">
                  <div className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-sm p-2" tabIndex={0} aria-label="NVDA dengan Firefox. Kombinasi yang paling disarankan.">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">NVDA + Firefox</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">Kombinasi paling stabil untuk mengakses SCITOSY. Gunakan Insert + F7 untuk daftar elemen.</p>
                  </div>
                  <div className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-sm p-2" tabIndex={0} aria-label="Windows Narrator + Edge. Tekan Win + Ctrl + Enter untuk memulai.">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Windows Narrator + Edge</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">Tekan Windows + Ctrl + Enter untuk mengaktifkan Narrator.</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-8">Catatan Suara</h1>
              <Card className="mb-10">
                <Input
                  label="Judul Catatan"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  aria-label="Judul Catatan"
                />
                <Button onClick={recording ? stopRecording : startRecording} variant={recording ? 'secondary' : 'primary'} aria-label={recording ? 'Hentikan rekaman' : 'Mulai rekaman'}>
                  <Mic size={16} /> {recording ? 'Berhenti' : 'Rekam'}
                </Button>
              </Card>

              <h2 className="text-xl font-semibold text-zinc-900 mb-6">Catatan Tersimpan</h2>
              <div className="flex flex-col gap-4">
                {records.length === 0 ? (
                  <p className="text-sm text-zinc-500">Belum ada catatan.</p>
                ) : (
                  records.map((r, i) => (
                    <Card key={i} className="flex justify-between items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950" tabIndex={0} aria-label={`${r.title}, direkam pada ${r.date}`}>
                      <div>
                        <div className="font-medium text-zinc-900">{r.title}</div>
                        <div className="text-xs text-zinc-500 mt-1">{r.date}</div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => new Audio(r.url).play()} aria-label="Putar catatan"><Play size={16}/></Button>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'forum' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-950 mb-8">Forum Komunitas</h1>
              <Card>
                <p className="text-sm text-zinc-500">Forum diskusi dalam pengembangan.</p>
              </Card>
            </div>
          )}
        </div>
        
        <div className="max-w-3xl mt-12">
          <LessonChat lessonContext={`Materi strategi aksesibilitas tentang bagian: ${activeTab === 'keyboard' ? 'Pintasan Keyboard' : activeTab === 'reader' ? 'Screen Reader' : activeTab === 'voice' ? 'Catatan Suara' : 'Forum'}`} />
        </div>
      </div>
    </div>
  );
}
