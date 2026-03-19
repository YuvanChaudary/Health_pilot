import React, { useState, useEffect } from 'react';
import './Vault.css';

const getIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📄';
  if (['png', 'jpg', 'jpeg'].includes(ext)) return '🖼️';
  return '📁';
};

function Vault() {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  const tagSuggestions = [
    "diabetes", "blood test", "Dr. Rao", "MRI", "prescription",
    "scan", "report", "cardiology", "orthopedic", "general"
  ];

  const handleUpload = () => {
    if (!file || !type) {
      alert("❌ Please select a file and type");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('tags', tags);

    fetch('http://localhost:5000/api/vault/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(json => {
        console.log("✅ Uploaded:", json);
        fetchFiles();
        setFile(null);
        setTags('');
        setType('');
      })
      .catch(err => {
        console.error("❌ Upload error:", err);
        alert("Upload failed. Try again.");
      });
  };

  const fetchFiles = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (filterType.trim()) params.append('type', filterType.trim());

    fetch(`http://localhost:5000/api/vault/files?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then(json => {
        console.log("📂 Vault files:", json);
        setFiles(json.files || []);
        setError('');
      })
      .catch(err => {
        console.error("❌ Vault fetch error:", err);
        setError("Failed to fetch files. Please check your server.");
        setFiles([]);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, [search, filterType]);

  const handleDelete = (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;

    fetch(`http://localhost:5000/api/vault/delete/${filename}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(json => {
        console.log("🗑️ Deleted:", json);
        fetchFiles();
      })
      .catch(err => {
        console.error("❌ Delete error:", err);
        alert("Delete failed. Try again.");
      });
  };

  return (
    <div className="vault-wrapper">
      <div className="vault-card">
        <h2>📁 Health Vault</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="upload-section">
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => setFile(e.target.files[0])} />
          <input
            type="text"
            placeholder="Tags (e.g. diabetes, Dr. Rao)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            list="tag-options"
          />
          <datalist id="tag-options">
            {tagSuggestions.map((tag, i) => (
              <option key={i} value={tag} />
            ))}
          </datalist>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="prescription">Prescription</option>
            <option value="report">Report</option>
            <option value="scan">Scan</option>
          </select>
          <button onClick={handleUpload}>📤 Upload</button>
        </div>

        <div className="vault-search">
          <input
            type="text"
            placeholder="Search by name or tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            <option value="prescription">Prescription</option>
            <option value="report">Report</option>
            <option value="scan">Scan</option>
          </select>
        </div>

        <div className="file-list">
          {files.length === 0 ? (
            <p>No files found. Try uploading or adjusting filters.</p>
          ) : (
            files.map((f, i) => (
              <div key={i} className="file-card">
                <p><strong>{getIcon(f.name)} {f.name}</strong></p>
                <p>🧾 Type: {f.type}</p>
                <p>🏷️ Tags: {f.tags}</p>
                <p>📅 Uploaded: {new Date(f.uploaded_at).toLocaleString()}</p>
                <div className="file-actions">
                  <a href={`http://localhost:5000/api/vault/preview/${f.name}`} target="_blank" rel="noopener noreferrer">👁️ Preview</a>
                  <a href={`http://localhost:5000/api/vault/download/${f.name}`} download>⬇️ Download</a>
                  <button onClick={() => handleDelete(f.name)}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Vault;
