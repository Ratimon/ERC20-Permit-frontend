<script>
	import {url} from '$lib/utils/url';
	import NavBar from '$lib/components/styled/navigation/NavBar.svelte';

</script>

<header>

	<NavBar
		links={[
			{href: url(''), title: 'Home'},
			{href: url('permit/'), title: 'Permit'},
		]}
	/>

</header>