<template>
  <div class="layout">
    <header class="header">
      <g-link class="heading-link" :to="{ name: 'home' }">
        <component :is="titleTag" class="heading">{{ config.siteName }}</component>
      </g-link>
    </header>
    <slot/>
  </div>
</template>

<script>
import config from '~/.temp/config.js';

export default {
  computed: {
    titleTag () {
      return this.$route.name === 'home' ? 'h1' : 'h6'
    },
    config () {
      return config
    }
  }
}
</script>


<style lang="css">
  /* * {
    margin: 0;
    padding: 0;
  } */
  html{
    color: #dbddde;
    background: #10171d;
    font-feature-settings : "palt";
  }
  a {
    /* color: #4dba87; */
    color: #ffcb2e;
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6 {
    /* font-family: 'Mali', cursive; */
    font-family: 'M PLUS Rounded 1c', cursive;
  }

  h1 {
    font-size: 48px;
  }

  h6 {
    font-size: 20px;
  }

  body {
    /* font-family: 'Nunito', sans-serif; */
    font-family: 'M PLUS Rounded 1c', cursive;
    margin: 0;
    font-size: 1.1rem;
    padding: 0;
  }

  .heading-link {
    color: black;
    text-decoration: none;
    color: #dbddde;
  }

  .layout {
    /* max-width: 600px; */
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }

  .layout {
    margin-top: 30px;
    margin-bottom: 50px;
  }

  .heading {
    margin-bottom: 20px;
    font-family: 'Mali', cursive;
    font-weight: bold;
  }

  pre{
    font-size: 1.2rem;
    margin-left: 20px;
    background: #364549;
    color: #e3e3e3;
    padding: 15px;
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    border-radius: 5px;
  }
</style>
