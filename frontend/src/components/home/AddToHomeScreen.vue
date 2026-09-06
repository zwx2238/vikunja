<template>
	<details
		v-if="!isInstalled"
		class="add-to-home-screen"
	>
		<summary>
			<Icon icon="arrow-up-from-bracket" />
			{{ $t('home.installApp') }}
		</summary>
		<p>
			{{ $t('home.addToHomeScreen') }}
		</p>
	</details>
</template>

<script lang="ts" setup>
const isInstalled = typeof window !== 'undefined'
	&& window.matchMedia('(display-mode: standalone)').matches
</script>

<style lang="scss" scoped>
.add-to-home-screen {
	margin-block-start: .75rem;
	font-size: .9rem;
	color: var(--text);

	@media print {
		display: none;
	}
}
.add-to-home-screen summary {
	cursor: pointer;
}
</style>
