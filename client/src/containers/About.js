import React, { Component } from "react";
import { del } from "../services/request.service";

export default class About extends Component {
  render() {
    return (
      <div>
        <h2>Bonjour, je m'appelle Claire,</h2>
        <p>
          J'ai travaillé de nombreuses années dans les Ressources Humaines avant
          de trouver ma <del>voix</del> voie dans le Développement Web.
        </p>
        <p>
          Ce projet de réseau social est l'aboutissement de ma formation de{" "}
          <span>Développeuse Full Stack JS.</span> C'est un projet difficile qui
          m'a permis de consolider et d'enrichir mes compétences en
          développement.
        </p>
        <p>
          Si vous voulez regarder sous le capot, rendez vous sur mon{" "}
          <a href="https://github.com/Bananaha/">github</a>. Vous y trouverez
          l'ensemble des projets sur lequel j'ai travaillé et aussi une photo de
          moi.
        </p>
        <div>
          <h3>La stack du projet</h3>
          <div>Icone React</div>
          <div>Icone Express</div>
          <div>Icone Node</div>
          <div>Icone Socket.io</div>
          <div>Icone Mongo</div>
        </div>
        <div>
          <h2>And last but not least,</h2>
          <p>
            Un grand merci à l'ensemble de l'équipe pédagogique de l'IFOCOP
            Parix XI, (you're Da Best !),
          </p>
          <p>
            à Quatre Epingles qui m'a fait confiance, qui a cru en moi et qui
            m'offre le café,
          </p>
          <p>à b2s sans qui j'aurais eu plus de mal à prendre mon envol,</p>
          <p>à mon cher et tendre qui m'a soutenu et accompagné,</p>
          <p>
            à tous mes camarades d'école (pas de favoritisme), c'était chouette{" "}
            <del>(HouHouuuu!!)</del> pardon..
          </p>
          <h3>A bientôt</h3>
          <h3>Claire</h3>
        </div>
      </div>
    );
  }
}
