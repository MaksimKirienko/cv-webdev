<template>
  <section class="contacts">
    <div id="contacts" class="local-link" />
    <div class="container">
      <div class="contacts-wrapper">
        <h2>
          Contacts
        </h2>
        <div class="contacts-h-sub">
          Look forward to contacting you.
          <br>
          All the best &#128521;
        </div>
        <div class="contacts-name">
          <b>Maksim</b> Kirienko
        </div>
        <div class="contacts-list">
          <div class="contacts-item">
            <div class="contacts-icon" v-html="require('assets/i/icons/location.svg?include')" />
            <div class="contacts-item-text">
              <div>
                Tbilisi, Georgia
                <br>
                <div class="contacts-relocation">
                  Searching for a remote / hybrid <br>
                  position with relocation &#128293;
                </div>
              </div>
            </div>
          </div>
          <div class="contacts-item">
            <div class="contacts-icon" v-html="require('assets/i/icons/tg.svg?include')" />
            <div class="contacts-item-text">
              <a href="https://t.me/vijener" target="_blank">@vijener</a>
            </div>
          </div>
          <div class="contacts-item">
            <div class="contacts-icon" v-html="require('assets/i/icons/email.svg?include')" />
            <div class="contacts-item-text">
              <a href="mailto:maxim.kirienko@gmail.com" target="_blank">maxim.kirienko@gmail.com</a>
            </div>
          </div>
          <div class="contacts-item">
            <div class="contacts-icon" v-html="require('assets/i/icons/linkedin.svg?include')" />
            <div class="contacts-item-text">
              <a href="https://www.linkedin.com/in/vijener/" target="_blank">https://www.linkedin.com/in/vijener/</a>
            </div>
          </div>
          <div class="contacts-item">
            <div class="contacts-icon" v-html="require('assets/i/icons/inst.svg?include')" />
            <div class="contacts-item-text">
              <a href="https://www.instagram.com/vijenerm/" target="_blank">@vijenerm</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.contacts {
  margin: 140px 0 40px 0;
  text-align: center;

  h2 {
    font-size: 14vw;
  }

  .contacts-h-sub {
    font-size: 5.5vw;
    line-height: 130%;
  }
}

@media (min-width: 576px) {
  .contacts {
    h2 {
      font-size: 80px;
    }
    .contacts-h-sub {
      font-size: 28px;
    }
  }
}

.contacts-wrapper {
  max-width: 460px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .contacts-wrapper {
    max-width: 682px;
  }
}

.contacts-name {
  margin-top: 57px;
  font-size: 34px;
  font-weight: 300;

  b {
    font-weight: 500;
  }
}

.contacts-relocation {
  margin-top: 7px;
  font-weight: 500;
  line-height: 130%;
}

.contacts-list {
  text-align: left;
  margin-top: 80px;
}

@media (min-width: 768px) {
  .contacts-list {
    margin-top: 140px;
  }
}

.contacts-item {
  display: flex;
  margin-bottom: 26px;
}

@media (min-width: 576px) {
  .contacts-item {
    margin-bottom: 56px;
  }
}

.contacts-icon {
  flex: 0 0 36px;
  margin-right: 20px;

  svg {
    max-width: 100%;
    max-height: 36px;
  }
}

@media (min-width: 768px) {
  .contacts-icon {
    flex: 0 0 50px;
    margin-right: 62px;

    svg {
      max-height: 50px;
    }
  }
}

.contacts-item-text {
  display: flex;
  align-items: center;
  font-size: 1rem;

  i {
    font-style: normal;
    font-weight: 300;
  }

  b {
    font-weight: 500;
  }
}

@media (min-width: 768px) {
  .contacts-item-text {
    font-size: 2rem;
  }
}
</style>
