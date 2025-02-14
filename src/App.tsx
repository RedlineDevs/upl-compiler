import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Editor } from './components/Editor';
import { FileList } from './components/FileList';
import { Button } from './components/ui/button';

export default function App() {
  const [files, setFiles] = useState<string[]>(() => {
    const saved = localStorage.getItem('upl-files');
    return saved ? JSON.parse(saved) : ['main.upl'];
  });

  const [activeFile, setActiveFile] = useState<string>(() => {
    const saved = localStorage.getItem('upl-active-file');
    return saved || files[0];
  });

  useEffect(() => {
    localStorage.setItem('upl-files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('upl-active-file', activeFile);
  }, [activeFile]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over.id.toString());
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addNewFile = () => {
    const newFile = `file${files.length + 1}.upl`;
    setFiles([...files, newFile]);
    setActiveFile(newFile);
  };

  const deleteFile = (file: string) => {
    if (files.length === 1) return;
    const newFiles = files.filter((f) => f !== file);
    setFiles(newFiles);
    if (activeFile === file) {
      setActiveFile(newFiles[0]);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="h-full flex bg-background text-foreground">
        <FileList
          files={files}
          activeFile={activeFile}
          onFileSelect={setActiveFile}
          onFileDelete={deleteFile}
          onFilesReorder={setFiles}
        />
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-primary" /* Updated logo */ />
              <h1 className="text-lg font-semibold">UPL Studio</h1>
            </div>
            <Button onClick={addNewFile}>
              <Plus className="h-4 w-4 mr-2" />
              New File
            </Button>
          </header>
          <div className="flex-1 min-h-0 relative">
            <Editor filename={activeFile} />
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
              {files.length} file{files.length > 1 ? 's' : ''}
            </div>
          </div>
        </main>
      </div>
    </DndContext>
  );
}
