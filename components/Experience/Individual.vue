<template>
  <div class="exp-cols">
    <div class="exp-block-text block block-padded">
      <div class="exp-pos-heading">
        <h3>
          Individual entrepreneur
          <br>
          Web developer
        </h3>
        <div class="h3-sub">
          Sep 2020 – Present, Remote
        </div>
        <div class="h3-sub-light">
          With Yode, Antepa, Rocket Business
        </div>
      </div>
      <div class="exp-text">
        <p>
          In collaboration with my general partner – the “Yode group”, has launched many marketing projects for major brands. Webview integration in applications, promo pages, games and gamification, 3d technologies in the web.
        </p>
        <p>
          Helped to develop the web direction of the business. Bringing new quality standards of web responsiveness, design, and optimization to the company.
        </p>
        <p>
          In cooperation with other partners, I took on technically complex tasks, where high-qualification or high-quality development in a short time was required.
        </p>
        <h4>Examples of marketing campaigns</h4>
        <p>
          <b>Pyaterochka retail chain + Brawl Stars collaboration.</b>
          <br>
          WebView game with match2 mechanics. Over 1.5M players. Software design based on OOP + event-driven programming with JS Promises. Realtime on-the-fly level editor. Nuxt SSG + nginx + CDN. DOM, Canvas, SVG, sprites, sounds, js animations, safari optimization, REST optimization. Error handling, testing, communication with app team.
        </p>
        <p>
          <b>Magnit retail chain + UNGA agency + Sony Pictures.</b>
          <br>
          WebView game with memo mechanics. Drawing for a collection of in-game 3d prizes.
        </p>
        <p>
          <a href="/#skills">
            watch my skills ›
          </a>
        </p>
      </div>
    </div>
    <div class="exp-block-right">
      <div class="exp-block-tr block block-padded">
        <div class="exp-logos">
          <picture>
            <source :srcset="require(`~/assets/i/experience/logos.jpg?sizes[]=1152&format=webp`).srcSet" type="image/webp">
            <img class="exp-logos-pic" width="1152" height="990" :src="require(`~/assets/i/experience/logos.jpg?resize&size=1152`)" alt="" loading="lazy">
          </picture>
        </div>
      </div>
      <div class="exp-block-br block">
        <div class="exp-gal">
          <picture>
            <source :srcset="require(`~/assets/i/experience/collabs.jpg?sizes[]=1364&format=webp`).srcSet" type="image/webp">
            <img class="exp-gal-pic" width="1364" height="944" :src="require(`~/assets/i/experience/collabs.jpg?resize&size=1364`)" alt="" loading="lazy">
          </picture>
        </div>
      </div>
    </div>
  </div>
</template>
