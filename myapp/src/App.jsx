import './App.css'

function App() {
  return (
    <div className="app">
      <header className="hero">
        <p className="pill">Frontend hub</p>
        <h1>Sai Scientifics UI Library</h1>
        <p>
          Launch the static pages or use this React shell as a starting point for
          the full web experience.
        </p>
      </header>

      <section className="grid">
        <a className="card" href="/TopRowbanner.html">
          <h3>Home</h3>
          <p>Primary landing layout with search and promos.</p>
        </a>
        <a className="card" href="/BuyOnCredit.html">
          <h3>Buy on Credit</h3>
          <p>Credit application flow with modal form.</p>
        </a>
        <a className="card" href="/Cart.html">
          <h3>Cart</h3>
          <p>Cart summary and checkout modal.</p>
        </a>
        <a className="card" href="/HelpCentre.html">
          <h3>Help Centre</h3>
          <p>FAQ search and support message form.</p>
        </a>
        <a className="card" href="/Requestforquotes.html">
          <h3>Request for Quotes</h3>
          <p>RFQ form and upload workflow.</p>
        </a>
        <a className="card" href="/TrackOrder.html">
          <h3>Track Order</h3>
          <p>Order status timeline and details.</p>
        </a>
        <a className="card" href="/WriteReview.html">
          <h3>Write Review</h3>
          <p>Submit a product review with ratings.</p>
        </a>
        <a className="card" href="/grievance.html">
          <h3>Grievance</h3>
          <p>Write directly to management.</p>
        </a>
      </section>
    </div>
  )
}

export default App
