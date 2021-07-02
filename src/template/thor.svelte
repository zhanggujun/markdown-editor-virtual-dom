<svelte:options accessors={ true } />
<div class="thor-editor" id="{ boxId }">
  <Head />
  <Body { value } { plugins } />
</div>
<script>
  import Head from '@/template/head.svelte'
  import Body from '@/template/body.svelte'
  export let value
  export let plugins
  export let boxId = `thor-${(new Date()).getTime()}-${Math.random()}`.replace(/\./,'')
</script>
