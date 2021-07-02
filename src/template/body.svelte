<svelte:options accessors={ true } />
<div class="thor-body">
  <textarea class="thor-inner" on:input={ onInput } { value } />
  <div class="thor-inner" style="margin-top:20px;">{ @html html }</div>
</div>
<script>

  import { onMount } from 'svelte'
  import { initPlugins } from '@/utils/index.js'

  export let value
  export let plugins

  let html = ''

  const onInput = event => {
    value = event.target.value
  }

  const setHtml = () => html = initPlugins(plugins,value)

  $:value && setHtml()

</script>
