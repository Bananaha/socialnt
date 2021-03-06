import React, { Component } from "react";
import "../styles/About.css";
export default class About extends Component {
  render() {
    return (
      <div className="About page-body ">
        <div className="About__container flex-extend">
          <h2 className="About__title accent">Bonjour, je m'appelle Claire,</h2>
          <p>
            J'ai travaillé de nombreuses années dans les Ressources Humaines
            avant de trouver ma <del>voix</del> voie dans le Développement Web.
          </p>
          <p>
            Ce projet de réseau social est l'aboutissement de ma formation de{" "}
            <span>Développeuse Full Stack JS.</span> C'est un projet difficile
            qui m'a permis de consolider et d'enrichir mes compétences en
            développement.
          </p>
          <p>
            Si vous voulez regarder sous le capot, rendez vous sur mon{" "}
            <a href="https://github.com/Bananaha/">github</a>. Vous y trouverez
            l'ensemble des projets sur lequel j'ai travaillé et aussi une photo
            de moi.
          </p>
          <div>
            <h4 className="About__title">La stack du projet</h4>
            <div className="About__stack-container">
              <div>React</div>
              <div>Express</div>
              <div>Node</div>
              <div>Socket.io</div>
              <div>Mongo</div>
            </div>
          </div>
          <div>
            <h4 className="About__title">And last but not least,</h4>
            <p>
              Un grand merci à l'ensemble de l'équipe pédagogique de l'IFOCOP
              Parix XI, (you're Da Best !), à Quatre Epingles qui m'a fait
              confiance, qui a cru en moi et qui m'offre le café, à b2s sans qui
              j'aurais eu plus de mal à prendre mon envol, à mon cher et tendre
              qui m'a soutenu et accompagné, à tous mes camarades d'école (pas
              de favoritisme), c'était chouette <del>(HouHouuuu!!)</del>{" "}
              pardon..
            </p>
            <h4 className="About__title accent">A bientôt. Claire</h4>
          </div>
        </div>
      </div>
    );
  }
}
