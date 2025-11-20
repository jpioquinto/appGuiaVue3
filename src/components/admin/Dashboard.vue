<script setup lang="ts"></script>
<template>
  <div class="mb-6 py-0 is-hidden1">
    <h3 class="title is-4 is-text-red-1 has-text-centered has-text-weight-semibold">
      Guía para la Integración de Proyectos de Modernización<br />
      Registral y Catastral
    </h3>
  </div>
  <div class="card">
    <div class="card-content">
      <div class="content py-6">
        <div class="columns is-desktop is-mobile">
          <div class="column is-two-fifths">
            <div class="field">
              <label class="label">Año</label>
              <div class="select is-fullwidth">
                <select>
                  <option>Seleccione el año</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">Entidad</label>
              <div class="select is-fullwidth">
                <select disabled>
                  <option>Seleccione la entidad</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">Vertiente</label>
              <div class="select is-fullwidth">
                <select disabled>
                  <option>Seleccione la vertiente</option>
                  <option>With options</option>
                </select>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="fixed-grid">
              <div class="grid">
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-sedatu-1 is-uppercase is-fullwidth is-justify-content-space-between"
                    >
                      <span></span>
                      <span>Consultar Proyecto</span>
                      <span class="icon">
                        <i class="fa-solid fa-magnifying-glass"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-red-1 is-uppercase is-fullwidth is-justify-content-space-between"
                    >
                      <span></span>
                      <span>Info del Proyecto</span>
                      <span class="icon has-text-right">
                        <i class="fa-solid fa-circle-info"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-sedatu-1 is-uppercase is-fullwidth is-justify-content-space-between"
                    >
                      <span></span>
                      <span>Ver Ficha Ténica</span>
                      <span class="icon">
                        <i class="fa-solid fa-chart-column"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-red-1 is-uppercase is-fullwidth is-justify-content-space-between"
                    >
                      <span></span>
                      <span>PDF (Con Montos)</span>
                      <span class="icon">
                        <i class="fa-solid fa-file-pdf"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-sedatu-1 is-uppercase is-fullwidth is-justify-content-space-between"
                    >
                      <span></span>
                      <span>Generar Dictamen</span>
                      <span class="icon">
                        <i class="fa-solid fa-list-check"></i>
                      </span>
                    </button>
                  </p>
                </div>
                <div class="cell">
                  <p class="buttons">
                    <button
                      class="button is-red-1 is-uppercase is-fullwidth is-justify-content-space-between"
                    >
                      <span></span>
                      <span>PDF (Sin Montos)</span>
                      <span class="icon">
                        <i class="fa-regular fa-file-pdf"></i>
                      </span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
