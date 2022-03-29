<template>
  <div class="exp-old">
    <div class="block block-padded">
      <div class="exp-old-container">
        <div class="exp-old-half">
          <div class="exp-pos-heading">
            <h3>
              Frontend, javascript
            </h3>
            <div class="h3-sub">
              Jan 2009 - Jan 2010
            </div>
            <div class="h3-sub-light">
              Mist – browser online game
            </div>
          </div>
          <div class="exp-text">
            <p>
              Produced front JS game engine. (before the release of Angular and other libs, IE6 compatible)
              Transferred the rendering part from the backend. Optimized speed and traffic.
              Refactor major system design with backend developers.
              Implemented a new interface and participated in the v2 major release.
            </p>
          </div>
        </div>
        <div class="exp-old-half">
          <div class="exp-pos-heading">
            <h3>
              Senior Web Developer
            </h3>
            <div class="h3-sub">
              Feb 2008 - Jan 2009
            </div>
            <div class="h3-sub-light">
              Siterostov
            </div>
          </div>
          <div class="exp-text">
            <p>
              Started as a web developer and quickly moved to a team lead and then to a senior developer position (5 developer team).
              Participated in the development of the company's own CMS with components drag&drop wisywig ajax editor. Developed 10+ client sites, SEO.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.exp-old {
  display: flex;
  flex-wrap: wrap;

  h3 {
    color: #29A82E;
  }
}

.exp-old-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.exp-old-wide, .exp-old-half {
  flex: 0 0 100%;
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
}

@media(min-width: 768px) {
  .exp-old-half {
    flex: 0 0 calc(50% - 61px);
    margin-bottom: 0;
  }
}
</style>
