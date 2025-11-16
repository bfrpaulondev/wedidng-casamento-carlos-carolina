import React from "react";

const Vip = () => {
  return (
    <main className="page page-vip">
      <section className="section">
        <div className="container">
          <h1 className="section-title">Área VIP</h1>
          <p className="section-subtitle">
            Espaço reservado para informações específicas sobre convidados VIP, família próxima
            e detalhes especiais do evento.
          </p>

          <div className="content-block">
            <h2>Convidados VIP</h2>
            <p>
              Usa esta página para listar convidados especiais, lugares reservados, prioridade de
              atendimento e qualquer instrução adicional ligada a estas pessoas.
            </p>
          </div>

          <div className="content-block">
            <h2>Notas e Detalhes Especiais</h2>
            <ul>
              <li>Lugares reservados na cerimónia e no copo d'água</li>
              <li>Pedidos específicos (alimentares, mobilidade, etc.)</li>
              <li>Contacto direto de alguém da equipa para acompanhamento</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Vip;
