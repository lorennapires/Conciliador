import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";

interface ExcelDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function ExcelDropzone({ file, onFileChange }: ExcelDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileChange(acceptedFiles[0]);
    }
  }, [onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
  });

  return (
    <motion.div
      {...getRootProps()}
      whileHover={{ scale: 1.01 }}
      animate={{ borderColor: isDragActive ? "#22d3ee" : "rgba(34,211,238,.25)" }}
      className="
      cursor-pointer
      rounded-3xl
      border-2
      border-dashed
      bg-slate-900/25
      p-12
      transition-all
      duration-300
      "
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div key="upload" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-cyan-400/60 text-cyan-300">
                <span className="text-[10px] font-bold tracking-wide">XLSX</span>
              </div>
            </div>

            <h2 className="mt-6 text-center text-2xl font-bold text-white">
              {isDragActive ? "Solte a planilha aqui" : "Arraste sua planilha Excel aqui"}
            </h2>

            <p className="mt-3 text-center text-slate-400">ou clique para selecionar</p>

            <div className="mt-8 flex justify-center gap-3">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">XLSX</span>
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">XLS</span>
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-300">CSV</span>
            </div>
          </motion.div>
        ) : (
          <motion.div key="arquivo" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="flex justify-center">
              <CheckCircle2 size={60} className="text-green-400" />
            </div>

            <h2 className="mt-5 text-center text-xl font-bold text-white">Arquivo carregado</h2>

            <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-black/20 p-5">
              <div className="flex items-center gap-4">
                <FileSpreadsheet size={40} className="text-green-400" />
                <div>
                  <p className="font-semibold text-white">{file.name}</p>
                  <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-cyan-300">Clique para trocar o arquivo</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}