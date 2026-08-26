<template>
	<BaseButton
		class="service-close-button"
		:class="{'is-standalone': standalone}"
		:aria-label="$t('misc.close')"
		:title="$t('misc.close')"
		@click="closeServiceHost()"
	>
		<Icon icon="xmark" />
	</BaseButton>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import {closeServiceHost} from '@/helpers/localAgentService'

withDefaults(defineProps<{
	standalone?: boolean
}>(), {
	standalone: false,
})
</script>

<style scoped lang="scss">
.service-close-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 40px;
	inline-size: 40px;
	block-size: 40px;
	color: var(--grey-400);
	font-size: 1.25rem;

	&:hover,
	&:focus-visible {
		color: var(--text);
		background: var(--grey-100);
	}

	&.is-standalone {
		position: fixed;
		inset-block-start: max(.75rem, env(safe-area-inset-top));
		inset-inline-end: max(.75rem, env(safe-area-inset-right));
		z-index: 40;
		border-radius: 4px;
		background: var(--site-background);
		box-shadow: var(--shadow-sm);
	}
}
</style>
