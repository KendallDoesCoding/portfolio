<!--TODO: transition-group-->
<template lang="pug">
  #app
    .error-container(
      @click="showSearchBar"
      @mouseenter="showSearchIcon"
      @mouseleave="hideSearchIcon"
      @mousemove="moveSearchIcon"
      @touchstart="showSearchIcon"
      @touchend="showSearchBar"
      @touchmove="moveTouchSearchIcon"
      @touchcancel="hideSearchIcon"
    )
      .error-code
        span 4
        span 0
        span 4
      .error-title ERROR
      .error-message PAGE NOT FOUND
      .error-message I think you just went to a page non-existing page.
      .error-message Click anywhere on the screen if you want to search for something.
      transition(name="search-icon-transition")
        .search-icon(
          ref="searchIcon"
          :style="{ top: search.y + 'px', left: search.x + 'px' }"
          v-if="search.show === true"
        )
    transition(name="search-window-transition")
      .search-window(
        ref="searchWindow"
        v-on:animationend="searchWindowAnimationEnd"
        v-bind:style="{ top: (searchBox.y !== null) ? searchBox.y + 'px' : ''," +
                     " left: (searchBox.x !== null) ? searchBox.x + 'px' : '' }"
        v-if="searchBox.show === true"
      )
        //- .search-window-label Search
        .search-window-search(:class="{'search-scrolling': searchBox.scrolling}")
          input(
            type="text"
            placeholder="Enter your keyword here..."
            ref="searchKeyword"
            v-model="searchBox.keyword"
          )
          button(type="button" @click="hideSearchBar")
            span
              span
              span
        .search-window-section(@scroll="searchWindowScroll")
          transition-group(name="search-window-container-transition" tag="div")
            .search-window-container(
              v-for="data, index in searchData"
              v-if="data.Name.toLowerCase().indexOf(searchBox.keyword.toLowerCase()) >= 0 ||" +
                   "data.Description.toLowerCase().indexOf(searchBox.keyword.toLowerCase()) >= 0"
              :key="index"
            )
              .search-window-title
                a(href="#" @click.prevent="") {{ data.Name }}
              .search-window-content {{ data.Description }}
</template>

<script>
export default {
  data() {
    return {
      search: {
        show: false,
        x: 0,
        y: 0
      },
      searchBox: {
        show: false,
        x: 0,
        y: 0,
        keyword: "",
        scrolling: false
      },
      searchData: []
    };
  },
  methods: {
    showSearchIcon(evt) {
      if (this.searchBox.show === false) {
        this.search.show = true;
      }
    },
    hideSearchIcon(evt) {
      this.search.show = false;
    },
    moveSearchIconAction(x, y) {
      let elm = this.$refs.searchIcon;
      let searchHalfSize = elm.clientWidth / 2;
      
      this.search.x = x - searchHalfSize;
      this.search.y = y - searchHalfSize;
    },
    moveSearchIcon(evt) {
      if (this.search.show === true) {
        this.moveSearchIconAction(
          evt.clientX, evt.clientY);
      }
    },
    moveTouchSearchIcon(evt) {
      evt.preventDefault();
      
      if (this.search.show === true) {
        this.moveSearchIconAction(
          evt.touches[0].clientX, evt.touches[0].clientY);
      }
    },
    showSearchBar(evt) {
      if (this.searchBox.show === false) {
        this.searchBox.show = true;
        this.search.show = false;
        
        this.searchBox.x = evt.clientX;
        this.searchBox.y = evt.clientY;
      }
    },
    hideSearchBar() {
      this.searchBox.show = false;
      this.searchBox.keyword = "";
      this.searchBox.scrolling = false;
    },
    searchWindowScroll(evt) {
      this.searchBox.scrolling = evt.target.scrollTop > 0;
    },
    searchWindowAnimationEnd() {
      this.searchBox.x = null;
      this.searchBox.y = null;
    }
  },
  mounted() {
    let self = this;
    
    fetch("https://assets.codepen.io/430361/animal_information.json", {
      cache: "no-cache"
    })
    .then(response => response.json())
    .then(function(data) {
      self.searchData = data;
    });
  },
  updated() {
    if (this.searchBox.show === true) {
      this.$refs.searchKeyword.focus();
    }
  }
};
</script>

<style lang="scss">
  $wave-time: 600ms;
  $wave-size: 1vmin;
  $wave-seq-list: 0vmin, -$wave-size, 0vmin, $wave-size, 0vmin, -$wave-size, 0vmin;

  $search-size: 2.8rem;
  
  $search-icon-rotate: -38deg;

  $search-show-time: 375ms;
  $search-fade-time: 256ms;
  $search-move-time: 32ms;

  $search-box-size: $search-size;
  
  $search-window-shown-width: calc(100vw - 4rem);
  $search-window-shown-height: calc(100vh - 4rem);
  $search-window-shown-top: 2rem;
  $search-window-shown-left: 2rem;
  $search-window-show-time: 512ms;

  @mixin input-field($padding) {
    font-family: inherit;
    font-size: inherit;
    padding: $padding;
    border: 0;
    outline: 0;
    margin: 0;
    box-sizing: border-box;
  }

  @mixin screen-text($font-size) {
    color: #ffffff;
    font-family: "Fredoka One", cursive;
    font-size: $font-size;
    text-align: center;
    text-shadow: ($font-size / 15) ($font-size / 15) rgba(#303030, 0.5);
    user-select: none;
  }

  @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700");
  @import url("https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap");

  body {
    width: 100vw;
    height: 100vh;
    font-size: 16px;
  }
  
  #app {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .error-container {
    background-image: linear-gradient(to bottom right, #6200c4, #ed6f00);
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    cursor: none;
    &:after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }

  .error-code {
    @include screen-text(24vmin);
    padding: 1.5vmin 5vmin;
    display: flex;
    span {
      font-weight: bold;
      display: block;
    }
    @for $i from 1 through 3 {
      span:nth-child(#{$i}) {
        animation: error-code-#{$i} $wave-time linear infinite;
      }
    }
  }

  @for $i from 1 through 3 {
    @keyframes error-code-#{$i} {
      @for $j from 1 through 5 {
        #{($j - 1) * 25}% {
          transform: translateY(nth($wave-seq-list, $j + ($i - 1)));
        }
      }
    }
  }

  .error-title {
    @include screen-text(2.8rem);
    padding: 1.5vmin 10vmin;
  }

  .error-message {
    @include screen-text(1.2rem);
    padding: 1.5vmin 30vmin;
  }

  .search-icon {
    $icon-width: 0.32rem;
    $box-shadow: -$icon-width $icon-width #{$icon-width * 2} rgba(#1f1f1f, 0.8);
    background-color: rgba(#69cdff, 0.5);
    width: $search-size;
    height: $search-size;
    border: solid $icon-width #fffb8c;
    box-sizing: border-box;
    border-radius: 50%;
    position: absolute;
    transform: rotate($search-icon-rotate);
    box-shadow: $box-shadow;
    pointer-events: none;
    transition: top $search-move-time cubic-bezier(0.22, 0.61, 0.36, 1),
      left $search-move-time cubic-bezier(0.22, 0.61, 0.36, 1);
    &.search-icon-transition-enter-active {
      animation: show-search-icon $search-show-time linear forwards;
    }
    &.search-icon-transition-enter-active,
    &.search-icon-transition-leave-active {
      transition: opacity $search-fade-time ease-out;
    }
    &.search-icon-transition-enter,
    &.search-icon-transition-leave-to {
      opacity: 0;
    }
    &:after {
      $width: 0.45rem;
      $height: 1.4rem;
      content: '';
      background-color: #30b3ff;
      width: $width;
      height: $height;
      position: absolute;
      bottom: -#{$height + $icon-width};
      left: calc(50% - #{$width / 2});
      border-radius: $width / 2;
    }
    &:after {
      box-shadow: $box-shadow;
    }
  }

  @keyframes show-search-icon {
    0% {
      transform: rotate($search-icon-rotate) scale(0);
    }
    40% {
      transform: rotate($search-icon-rotate) scale(1.15);
    }
    60% {
      transform: rotate($search-icon-rotate) scale(0.9);
    }
    80% {
      transform: rotate($search-icon-rotate) scale(1.05);
    }
    100% {
      transform: rotate($search-icon-rotate) scale(1);
    }
  }

  .search-window {
    font-family: "Open Sans", sans-serif;
    background-color: rgba(#ffffff, 0.7);
    width: $search-window-shown-width;
    height: $search-window-shown-height;
    border-radius: 1.25rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0.5rem 1.2rem 2rem rgba(#000000, 0.7);
    box-sizing: border-box;
    position: absolute;
    top: $search-window-shown-top;
    left: $search-window-shown-left;
    overflow: hidden;
    backdrop-filter: blur(15px);
    animation: search-window-show $search-window-show-time ease-out;
    &.search-window-transition-leave-active {
      transition: opacity $search-fade-time ease-out;
    }
    &.search-window-transition-enter,
    &.search-window-transition-leave-to {
      opacity: 0;
    }
  }
  
  .search-window-label {
    color: #ffffff;
    font-family: "Fredoka One", cursive;
    font-size: 24px;
    text-align: center;
    background-image: linear-gradient(to right, #1f7ced, #70ffea);
    width: 100%;
    height: 2.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    flex-grow: 0;
  }
  
  .search-window-search {
    display: flex;
    flex-shrink: 0;
    flex-grow: 0;
    box-shadow: 0 0 0 #8f8f8f;
    transform: translateZ(1px);
    transition: box-shadow 120ms ease-out;
    &.search-scrolling {
      box-shadow: 0 0.2rem 0.65rem #8f8f8f;
    }
    input[type="text"] {
      @include input-field(0 1rem);
      background-color: transparent;
      width: 100%;
      flex-grow: 1;
    }
    button[type="button"] {
      $background-color: transparent;
      @include input-field(0);
      background-color: $background-color;
      width: $search-box-size;
      height: $search-box-size;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
      border-radius: 0;
      & > span {
        $animation-time: 500ms;
        $animation-delay: $search-window-show-time;
        width: 100%;
        height: 100%;
        display: block;
        transition: transform 250ms cubic-bezier(0.18, 0.89, 0.32, 2.28);
        & > span {
          $width: 1.6rem;
          $height: 0.3rem;
          content: "";
          background-color: #000000;
          width: $width;
          height: $height;
          opacity: 0;
          position: absolute;
          top: calc(50% - #{$height / 2});
          left: calc(50% - #{$width / 2});
          border-radius: 0.1rem;
          transform-origin: center center;
        }
        & > span:nth-child(1) {
          animation: close-icon-show-1 $animation-time ease-out $animation-delay forwards;
        }
        & > span:nth-child(2) {
          animation: close-icon-show-2 $animation-time ease-out $animation-delay forwards;
        }
        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }

  @keyframes search-window-show {
    0% {
      width: 0;
      height: 0;
    }
    30%,
    35% {
      width: $search-box-size;
      height: $search-box-size;
      top: $search-window-shown-top;
      left: $search-window-shown-left;
    }
    65%,
    75% {
      width: $search-window-shown-width;
      height: $search-box-size;
      top: $search-window-shown-top;
      left: $search-window-shown-left;
    }
    100% {
      width: $search-window-shown-width;
      height: $search-window-shown-height;
      top: $search-window-shown-top;
      left: $search-window-shown-left;
    }
  }
  
  @keyframes close-icon-show-1 {
    0% {
      opacity: 0;
      transform: rotate(45deg) translateX(1rem);
    }
    100% {
      opacity: 1;
      transform: rotate(45deg) translateX(0rem);
    }
  }
  
  @keyframes close-icon-show-2 {
    0% {
      opacity: 0;
      transform: rotate(-45deg) translateX(1rem);
    }
    100% {
      opacity: 1;
      transform: rotate(-45deg) translateX(0rem);
    }
  }
  
  .search-window-section {
    $padding: 0.4rem;
    height: 100%;
    flex-shrink: 1;
    flex-grow: 1;
    overflow: auto;
    .search-window-container {
      padding: #{$padding * 2} #{$padding * 2};
      transition: background-color 150ms ease-out;
      &.search-window-container-transition-enter-active,
      &.search-window-container-transition-leave-active {
        transition: opacity 150ms ease-out;
      }
      &.search-window-container-transition-enter,
      &.search-window-container-transition-leave-to {
        opacity: 0;
      }
      &:hover {
        background-color: rgba(#000000, 0.1);
      }
    }
    .search-window-title {
      padding: $padding #{$padding * 2};
      a {
        color: inherit;
        font-size: 110%;
        font-weight: bold;
        text-decoration: none;
        display: inline-block;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .search-window-content {
      padding: $padding #{$padding * 2};
    }
  }
</style>
