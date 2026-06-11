import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function NewPropertyPage() {
  return (
    <main className="page">
      <Navbar />
      <section className="pageTop">
        <div className="container">
          <h1>Novo Imóvel</h1>
          <p>Formulário visual inicial. Na próxima etapa, conectamos com banco de dados e upload de fotos.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <form className="formGrid">
            <input className="input" placeholder="Título do imóvel" />
            <select className="select" defaultValue=""><option value="" disabled>Operação</option><option>Venda</option><option>Locação</option></select>
            <input className="input" placeholder="Valor" />
            <input className="input" placeholder="Cidade" />
            <input className="input" placeholder="Bairro" />
            <input className="input" placeholder="Área" />
            <input className="input" placeholder="Dormitórios" />
            <input className="input" placeholder="Vagas" />
            <textarea className="textarea" placeholder="Descrição do imóvel" />
            <button className="btnDark full" type="button">Salvar imóvel</button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
