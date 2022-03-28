<template>
  <section class="edu">
    <div id="education" class="local-link" />
    <div class="edu-container container">
      <div class="edu-heading bl-pad">
        <h2>
          Education
        </h2>
        <div class="h2-sub">
          I combine hard and soft skills in my education.
          Even in management positions, I have always maintained a high level of
          competence in programming and technical aspects of work. I don't limit the
          range of knowledge, but I'm always ready to go into detail if necessary to
          achieve the best result.
        </div>
      </div>

      <div class="edu-university block block-padded">
        <div class="edu-university-desc">
          <div class="edu-university-small">
            2003-2009
          </div>

          Bachelor’s degree in<br>
          computer science<br>
          with honors

          <div class="edu-university-small">
            Rostov-on-Don, Russia
          </div>
        </div>
        <div class="edu-university-title">
          Don State<br>
          Technical University
        </div>
        <div class="edu-university-pic" v-html="require(`~/assets/i/education/university.svg?include`)" />
      </div>

      <div class="edu-cols">
        <div class="edu-cols-c1 bl-pad">
          <h2>
            Certifications
          </h2>
          <div class="edu-cert-list">
            <div class="edu-cert">
              <h4>
                Certificate of Completion - React + Redux
              </h4>
              <div class="edu-cert-company">
                Udemy
              </div>
              <div class="edu-cert-issue">
                Issued Jun 2019 · No Expiration Date
              </div>
              <div class="edu-cert-credentials">
                <a href="https://www.udemy.com/certificate/UC-YQJAEGXA/" target="_blank">
                  Credential ID UC-YQJAEGXA
                </a>
              </div>
            </div>
            <div class="edu-cert">
              <h4>
                ICAgile Certified Professional
              </h4>
              <div class="edu-cert-company">
                ICAgile
              </div>
              <div class="edu-cert-issue">
                Issued Sep 2018 · No Expiration Date
              </div>
              <div class="edu-cert-credentials">
                <a href="https://www.icagile.com/credentials/7e8c311f-42a2-4079-b418-d6fe7d1c5ca9" target="_blank">
                  Credential ID 97-11090-7e8c311f-42a2-4079-b418-d6fe7d1c5ca9
                </a>
              </div>
            </div>
            <div class="edu-cert">
              <h4>
                Advanced Google Analytics
              </h4>
              <div class="edu-cert-company">
                Google
              </div>
              <div class="edu-cert-issue">
                Issued Nov 2018 · Expired Nov 2021
              </div>
              <div class="edu-cert-credentials">
                <a href="https://analytics.google.com/analytics/academy/certificate/3Uxv79IxRHmbbzLYiydEsg" target="_blank">
                  Credential
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="edu-cols-c2 bl-pad">
          <h2>
            Languages
          </h2>
          <div class="edu-lang">
            <h4 class="edu-lang-name">
              English
            </h4>
            <div class="edu-lang-level">
              Upper Intermediate (B2)
            </div>
          </div>
          <div class="edu-lang">
            <h4 class="edu-lang-name">
              Russian
            </h4>
            <div class="edu-lang-level">
              Native
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.edu {
  padding-top: 55px;
  padding-bottom: 55px;

  .h2-sub {
    max-width: 632px;
  }
}

@media(min-width: 576px) {
  .edu {
    padding-top: 110px;
    padding-bottom: 130px;
  }
}

.edu-heading {
  padding-bottom: 35px;
}

@media(min-width: 768px) {
  .edu-heading {
    padding-bottom: 70px;
  }
}

.edu-university {
  display: flex;
  flex-wrap: wrap;
  color: #fff;
  justify-content: space-between;
  background: linear-gradient(204.58deg, #0087D2 10.66%, #006AE5 90.81%);
  margin-bottom: 70px;
}

@media (min-width: 768px) {
  .edu-university {
    margin-bottom: 140px;
  }
}

.edu-university-desc {
  flex: 0 0 100%;
  font-weight: 500;
}

.edu-university-small {
  font-size: 90%;
  font-weight: 300;

  &:first-child {
    margin-bottom: 30px;
  }
  &:last-child {
    margin-top: 30px;
  }
}

.edu-university-title {
  flex: 0 0 100%;
  font-weight: 500;
  font-size: 8.5vw;
  line-height: 120%;
  margin-top: 20px;
}

@media (min-width: 768px) {
  .edu-university-desc {
    flex: 0 0 38%;
  }
  .edu-university-title {
    flex: 0 0 58%;
    font-size: 5vw;
  }
}

@media (min-width: 1400px) {
  .edu-university-title {
    font-size: 72px;
  }
}

.edu-university-pic {
  flex: 0 0 100%;
  width: 100%;
  height: auto;
  display: block;
  margin-top: 50px;
}

.edu-cols {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 50px;
}

.edu-cert-list {
  h4 {
    color: #29A82E;
    margin: 0;
  }
}

.edu-cert {
  margin-bottom: 60px;
}

@media (min-width: 768px) {
  .edu-cert {
    &:last-child {
      margin-top: 0;
    }
  }
}

.edu-cert-company {
  font-weight: 600;
  margin: 8px 0;
}

.edu-cert-issue {
  font-weight: 300;
}

.edu-cert-credentials {
  font-weight: 300;
  margin-top: 8px;
}

.edu-lang {
  font-weight: 600;
}

.edu-lang-name {
  margin-bottom: 8px;
}
</style>
