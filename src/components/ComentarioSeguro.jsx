import React, { useState } from "react";

const ComentariosSeguros = () => {
  const [comentario, setComentario] = useState(""); // Estado para el input
  const [respuestaServidor, setRespuestaServidor] = useState(""); // Estado para lo que vuelve del backend

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto: comentario }),
      });

      const data = await response.json();

      if (data.data) {
        setRespuestaServidor(data.data.comentarioRecibido);
      }
    } catch (error) {
      console.error("Error al enviar el comentario:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Sistema de Comentarios Seguro</h2>

      {/* 1. Creación del Formulario */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)} // 2. Manejo de Datos (Controlado)
          placeholder="Escribe tu comentario aquí..."
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <br />
        <button type="submit">Enviar Comentario</button>
      </form>

      <hr />

      <h3>Comentario Recibido:</h3>

      {/* 3. Prevención de Vulnerabilidades (Método Seguro) */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          background: "#f9f9f9",
        }}
      >
        {respuestaServidor}
      </div>

      {/* --- RETO DE SEGURIDAD (Solo para observar el riesgo) ---
      <div 
        dangerouslySetInnerHTML={{ __html: respuestaServidor }} 
      /> 
      */}
    </div>
  );
};

export default ComentariosSeguros;
