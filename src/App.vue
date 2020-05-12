<template>
<div class="vue-world-map">
    <div id="map"
         v-on:mousemove="mouseOverMap"
         v-on:mouseleave="hover_country = ''"
         v-on:click="selectCountry"
         v-on:mousedown="mouseDownMap"
         v-on:mouseup="mouseUpMap"
    >
        <div id="map-controls">
            <div id="zoomin" v-on:click="zoomin">+</div>
            <div id="zoomout" v-on:click="zoomout">-</div>
        </div>
        <Map
           v-bind:transX='transX'
           v-bind:transY='transY'
           v-bind:scale='scale'
        />
    </div>
    <div id="sidebar">
        <div id="country_name">{{selected_country}}</div>
        <div id="no-crisis" v-if="selected_country && ! selected_country_data">
            No listed crises for {{selected_country}}
        </div>
        <div id="country_crisis_list">
            <ul>
                <li
                    v-for="(crisis, link) in selected_country_data"
                    v-on:click="selectCrisis"
                    v-bind:id="link"
                    v-bind:class="{selected: link == selected_crisis_index}"
                    v-bind:key="link"
                >
                    {{crisis[0]}}
                </li>
            </ul>
        </div>
        <div id="crisis_info">
            <p v-if='selected_crisis_link' id="wiki_link"> <a v-bind:href="'https://en.wikipedia.org' + selected_crisis_link" target="_blank">Read on Wikipedia</a></p>
            <div id="crisis_info_inner" v-html='selected_crisis_info'></div>
        </div>
    </div>
    <div
      id="country_hover"
      v-if="hover_country"
      v-bind:style="{left: ''+mouse_location_x+'px', top: ''+mouse_location_y+'px'}"
    >
        {{hover_country}}
    </div>
</div>
</template>

<script>
import Map from './Map';
import json from './data.json'

export default {
  components: { Map },
  props: {
  },
  data() {
    return {
      conflictData: json,
      selected_country: 'Select a country',
      selected_country_data: [],
      selected_crisis_info: '',
      selected_crisis_index: '',
      selected_crisis_link: '',

      mouse_location_x: 0,
      mouse_location_y: 0,
      hover_country: '',

      transX: 0,
      transY: 0,
      scale: 1,

      mapSelectedX: 0,
      mapSelectedY: 0,
    };
  },
  watch: {
      selected_country: function(newC) {
          if (!newC) return
          var el = document.getElementById('country_name')
          el.innerText = newC
          var fontSize = 100;
          el.style.setProperty('height', 'calc(10vh - 10px)')
          el.style.setProperty('font-size', ''+fontSize+'px')
          while (el.scrollHeight > el.clientHeight) {
              fontSize -= 1
              el.style.setProperty('font-size', ''+fontSize+'px')
          }
          el.style.setProperty('height', 'auto')
      }
  },
  methods: {
      mouseDownMap: function(e) {
          this.mapSelectedX = e.clientX - this.transX
          this.mapSelectedY = e.clientY - this.transY
      },
      mouseUpMap: function() {
          this.mapSelectedX = 0
          this.mapSelectedY = 0
      },
      zoomin: function() {
          this.scale *= 1.2
      },
      zoomout: function() {
          this.scale /= 1.2
      },
      selectCrisis: function(e) {
          this.selected_crisis_index = e.target.getAttribute('id')
          this.selected_crisis_info = this.selected_country_data[e.target.getAttribute('id')][1]
          this.selected_crisis_link = this.selected_country_data[e.target.getAttribute('id')][2]
      },
      mouseOverMap: function(e) {
          if (this.mapSelectedX) {
              this.transX = e.clientX - this.mapSelectedX
              this.transY = e.clientY - this.mapSelectedY
          }
          this.mouse_location_x = e.clientX + 1
          this.mouse_location_y = e.clientY + 18
          if (e.target.classList.contains('land')) {
              this.hover_country = e.target.getAttribute('title')
          } else {
              this.hover_country = ''
          }
      },
      selectCountry: function(e) {
          if (e.target.classList.contains('land')) {
              var c = document.getElementsByClassName('selected-country')
              while (c.length)
                c[0].classList.remove('selected-country')
              this.selected_crisis_index = ''
              this.selected_crisis_info = ''
              this.selected_crisis_link = ''
              this.selected_country = e.target.getAttribute('title')
              this.selected_country_data = this.conflictData[e.target.getAttribute('id')]
              e.target.classList.add('selected-country')
          }
      },
  },
  mounted() {
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto|Source+Code+Pro&display=swap');

body {
    margin: 0;
    background-color: black;
    font-family: 'Roboto', sans-serif;
    height: 100vh;
}
.vue-world-map {
    height: 100vh;
}

#map {
    width: 70vw;
    display: inline-block;
    top: 50%;
    position: absolute;
    transform: translateY(-50%);
}

#sidebar {
    display: flex;
    flex-direction: column;
    width: 30vw;
    position: absolute;
    top: 0;
    right: 0;
    height: 100vh;
}

#country_name {
    font-size: 50px;
    text-align: center;
    color: white;
    font-family: 'Source Code Pro', monospace;
    margin: 10px;
}

#country_crisis_list {
    margin: 20px 0;
    color: white;
}
#country_crisis_list ul {
    margin: 0;
}
#country_crisis_list ul li {
    margin: 2px 0;
    list-style: none;
    cursor: pointer;
}
#country_crisis_list ul li.selected {
    color: red;
}
#country_crisis_list ul li:hover {
    text-decoration: underline;
}

#crisis_info {
    margin-top: 20px;
    height: calc(80vh - 20px);
    overflow-y: auto;
    color: white;
}
#crisis_info p {
    padding: 15px;
    padding-top: 0;
    margin: 0
}

#map-svg {
  height: 100%;
}
path.land {
    fill: black;
    stroke: green;
    stroke-width: 1px;
    cursor: pointer;
}
path.land:hover {
    fill: white;
}
path.land.selected-country {
    fill: green;
}

#wiki_link a {
    color: white;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
  border: 2px solid white
}

/* Track */
::-webkit-scrollbar-track {
  background: black;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: white;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

#country_hover {
    position: absolute;
    color: white;
    pointer-events: none;
    background-color: black;
    border: 1px solid white;
    padding: 3px;
    font-family: 'Source Code Pro', monospace;
}

@media only screen and (max-width: 800px) {
    #country_name {
        font-size: 4vw;
    }
}

@media only screen and (max-width: 800px) {
    #map {
        width: 100%;
        top: 0;
        transform: none;
        position: relative;
    }
    #sidebar {
        width: 100%;
        position: relative;
    }
    #crisis_info {
        overflow-y: unset;
    }
}

#map-controls {
    font-family: 'Source Code Pro', monospace;
    font-size: 200%;
    color: white;
    position: absolute;
    right: 0;
}
#zoomin {
    cursor: pointer;
}
#zoomout {
    cursor: pointer;
}

#no-crisis {
    color: white;
    margin: 20px 100px;
}

</style>

