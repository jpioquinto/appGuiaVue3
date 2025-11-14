<template>
  <header class="hero is-primary">
    <div class="hero-head">
      <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <img class="navbar-brand-logo" :src="gobierno" alt="SEDATU" />
          <a class="navbar-item"> </a>
          <a class="navbar-item is-tab is-hidden-mobile1">
            <span class="icon is-medium"><i class="fa fa-home"></i></span>Inicio
          </a>
          <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navMenuGuia"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div class="navbar-menu" id="navMenuGuia">
          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link has-text-weight-medium">
                <span class="icon is-small"> <i class="fas fa-user-circle"></i> </span>&nbsp;
                {{ 'nickname' }}
              </a>

              <div class="navbar-dropdown is-right is-boxed">
                <a class="navbar-item">
                  <span class="icon is-small">
                    <i class="fa fa-power-off"></i>
                  </span>
                  &nbsp; Salir
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>
