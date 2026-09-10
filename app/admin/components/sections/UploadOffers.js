import { useState, useRef } from "react";
import { server_config } from '@/app/utils/server_config';

const BASE_API = `${server_config.api_protocol}://${server_config.site_folder}/xlsx`;
const UPLOAD_URL = `${BASE_API}/upload-offers/${server_config.site_key}/`;
const EXPORT_URL = `${BASE_API}/export-offers/${server_config.site_key}/`;

export default function UploadOffers({ setAllOffers_plans }) {
  const [file, setFile]         = useState(null);
  const [mode, setMode]         = useState("append"); // "append" | "replace"
  const [status, setStatus]     = useState("idle"); // idle | loading | success | error
  const [result, setResult]     = useState(null);
  const inputRef                = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) { setFile(f); setStatus("idle"); setResult(null); }
  };

  const refreshOffers = async () => {
    const newAllOffers_plans_res = await fetch(
      `${server_config.api_protocol}://${server_config.site_folder}/front/getOffers/${server_config.site_key}`,
      {
        ...(true
          ? { cache: 'no-store' }
          : { next: { revalidate: server_config.сaching_period } })
      }
    );
    const newAllOffers_plans_data = await newAllOffers_plans_res.json();
    const newAllOffers_plans = newAllOffers_plans_data.data;
    setAllOffers_plans([...newAllOffers_plans.sort((a, b) => a.position - b.position)]);
  };

  const handleSubmit = async () => {
    if (!file) return;

    if (mode === "replace") {
      const ok = window.confirm(
        "Режим «Заменить всё» удалит ВСЕ текущие тарифы и заменит их данными из файла. Продолжить?"
      );
      if (!ok) return;
    }

    setStatus("loading");
    setResult(null);

    const form = new FormData();
    form.append("file", file);
    form.append("mode", mode);

    try {
      const res  = await fetch(UPLOAD_URL, { method: "POST", body: form });
      const data = await res.json();
      setResult(data);
      setStatus(res.ok ? "success" : "error");

      if (res.ok) {
        await refreshOffers();
      }
    } catch (err) {
      console.error(err);
      setResult({ error: "Не удалось связаться с сервером" });
      setStatus("error");
    }
  };

  // Никакого fetch/blob: сервер уже отдаёт файл с Content-Disposition: attachment,
  // поэтому обычная ссылка сама скачивает файл без открытия вкладки/окна.
  const handleExport = () => {
    const a = document.createElement("a");
    a.href = EXPORT_URL;
    // a.download здесь не обязателен (имя файла и так задаёт бэкенд),
    // но можно оставить как подсказку для браузера
    a.download = `offers_${server_config.site_key}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const reset = () => {
    setFile(null); setStatus("idle"); setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={styles.title}>Загрузка тарифов</h2>
            <p style={styles.sub}>Файл Excel (.xlsx) по шаблону — строки начиная с третьей</p>
          </div>
          <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={handleExport}>
            ⬇ Экспорт текущих тарифов
          </button>
        </div>

        {/* Режим импорта */}
        <div style={styles.modeRow}>
          <label style={styles.modeOption}>
            <input
              type="radio"
              name="import-mode"
              checked={mode === "append"}
              onChange={() => setMode("append")}
            />
            Дополнить текущие тарифы
          </label>
          <label style={styles.modeOption}>
            <input
              type="radio"
              name="import-mode"
              checked={mode === "replace"}
              onChange={() => setMode("replace")}
            />
            Заменить все тарифы
          </label>
        </div>
        {mode === "replace" && (
          <p style={styles.warning}>
            ⚠ Все текущие тарифы будут удалены и заменены данными из файла.
          </p>
        )}

        {/* Дроп-зона */}
        <div
          style={{ ...styles.drop, ...(file ? styles.dropActive : {}) }}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={handleFile}
          />
          {file ? (
            <span style={styles.fileName}>📄 {file.name}</span>
          ) : (
            <span style={styles.dropHint}>Перетащите файл сюда или нажмите для выбора</span>
          )}
        </div>

        {/* Кнопки */}
        <div style={styles.actions}>
          <button
            style={{ ...styles.btn, ...styles.btnPrimary, ...((!file || status === "loading") ? styles.btnDisabled : {}) }}
            onClick={handleSubmit}
            disabled={!file || status === "loading"}
          >
            {status === "loading" ? "Загружаем…" : "Загрузить"}
          </button>
          {(file || result) && (
            <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={reset}>
              Сбросить
            </button>
          )}
        </div>

        {/* Результат */}
        {result && (
          <div style={{ ...styles.result, ...(status === "success" ? styles.resultOk : styles.resultErr) }}>
            {status === "success" && (
              <>
                <p style={styles.resultTitle}>{result.message}</p>
                {result.skipped > 0 && (
                  <p style={styles.skipped}>Пропущено строк: {result.skipped}</p>
                )}
              </>
            )}
            {status === "error" && (
              <p style={styles.resultTitle}>{result.error || result.message}</p>
            )}

            {/* Список ошибок по строкам */}
            {result.errors?.length > 0 && (
              <div style={styles.errList}>
                <p style={styles.errListTitle}>Проблемные строки:</p>
                {result.errors.map((e, i) => (
                  <div key={i} style={styles.errItem}>
                    <strong>Строка {e.row}</strong> ({e.name}):{" "}
                    {e.issues.join("; ")}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", justifyContent: "center", padding: 24 },
  card: {
    width: "100%", maxWidth: 640, background: "#fff", borderRadius: 12,
    padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  headerRow: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
    gap: 12, flexWrap: "wrap", marginBottom: 12,
  },
  title: { margin: 0, fontSize: 20, fontWeight: 600 },
  sub: { margin: "4px 0 0", fontSize: 13, color: "#666" },
  modeRow: { display: "flex", gap: 20, marginBottom: 8, flexWrap: "wrap" },
  modeOption: { display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer" },
  warning: { fontSize: 13, color: "#a15c00", background: "#fff4e0", padding: "8px 12px", borderRadius: 8, marginBottom: 12 },
  drop: {
    border: "2px dashed #ccc", borderRadius: 10, padding: 32, textAlign: "center",
    cursor: "pointer", color: "#888", marginBottom: 16,
  },
  dropActive: { borderColor: "#4a7dff", color: "#333", background: "#f5f8ff" },
  dropHint: { fontSize: 14 },
  fileName: { fontSize: 14, fontWeight: 500 },
  actions: { display: "flex", gap: 10 },
  btn: { padding: "10px 18px", borderRadius: 8, border: "none", fontSize: 14, cursor: "pointer" },
  btnPrimary: { background: "#4a7dff", color: "#fff" },
  btnSecondary: { background: "#eee", color: "#333" },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  result: { marginTop: 16, padding: 14, borderRadius: 10, fontSize: 14 },
  resultOk: { background: "#eaf7ea", color: "#1e6b1e" },
  resultErr: { background: "#fdeaea", color: "#a11" },
  resultTitle: { margin: 0, fontWeight: 600 },
  skipped: { margin: "4px 0 0" },
  errList: { marginTop: 10 },
  errListTitle: { fontWeight: 600, margin: "0 0 6px" },
  errItem: { fontSize: 13, marginBottom: 4 },
};
