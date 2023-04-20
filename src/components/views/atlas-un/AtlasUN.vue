<template>
  <div id="atlas-un" class="atlas-un">
    <AtlasUNHeader id="atlas-un-header" class="atlas-un-header"></AtlasUNHeader>
    <div id="atlas-un-paneles" class="atlas-un-paneles">
      <div id="atlas-un-left-container" :style="{ width: leftWidth + 'px' }">
        <AtlasUNLeftPanel id="atlas-un-left-panel" class="atlas-un-left-panel" @option-atlas="actualizarOption"></AtlasUNLeftPanel>
      </div>
      <div id="atlas-un-separador" class="atlas-un-separador" @mousedown="startResize"></div>
      <div id="atlas-un-right-container" :style="{ width: rightWidth + 'px' }">
        <AtlasUNRightPanel id="atlas-un-right-panel" class="atlas-un-right-panel" :actualAtlas="optionAtlas"></AtlasUNRightPanel>
      </div>
    </div>
  </div>
</template>

<script>
import AtlasUNHeader from './AtlasUNHeader.vue';
import AtlasUNLeftPanel from './AtlasUNLeftPanel.vue';
import AtlasUNRightPanel from './AtlasUNRightPanel.vue';

export default {
  name: 'AtlasUN',
  components: { AtlasUNHeader, AtlasUNLeftPanel, AtlasUNRightPanel },
  data() {
    return {
      leftWidth: window.innerWidth/3,
      rightWidth: 2*window.innerWidth/3,
      isResizing: false,
      optionAtlas: 1
    };
  },
  methods: {
    startResize() {
      this.isResizing = true;
      window.addEventListener('mousemove', this.doResize);
      window.addEventListener('mouseup', this.stopResize);
    },
    doResize(event) {
      if (!this.isResizing) return;
      const leftSize = Math.min(event.clientX,window.innerWidth)
      this.leftWidth = leftSize;
      this.rightWidth = window.innerWidth - leftSize;
    },
    stopResize() {
      this.isResizing = false;
      window.removeEventListener('mousemove', this.doResize);
      window.removeEventListener('mouseup', this.stopResize);
    },
    actualizarOption(option){
      this.optionAtlas = option
    }
  }
}
</script>

<style scoped>
.atlas-un {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.atlas-un-header {
  width: 100vw;
  height: 25px;
}

.atlas-un-paneles {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100vw;
}

.atlas-un-left-panel {
  height: 100%;
  overflow: auto;
  width: 100%;
}

.atlas-un-separador {
  width: 8px;
  height: 100vh;
  cursor: ew-resize;
  user-select: none;
  -webkit-app-region: no-drag;
  background-color: #e8e8e8;
  border-left: 2px solid #d3d3d3;
  box-shadow: inset 2px 0px 0px #f2f2f2, inset -2px 0px 0px #f2f2f2;
}

.atlas-un-right-panel {
  height: 100%;
  overflow: auto;
  width: 100%;
}
</style>
