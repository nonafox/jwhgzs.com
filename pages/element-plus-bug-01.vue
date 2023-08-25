<template>
    <!-- this is ElementPlus's bug. see: https://github.com/element-plus/element-plus-nuxt-starter/issues/23 -->
	<el-select placeholder="bug" no-data-text="bug-aaa"></el-select>
	<el-select placeholder="bug" no-data-text="bug-bbb"></el-select>
	
	<!-- according to the advice, use <client-only></client-only> temply -->
    <client-only>
    	<el-select placeholder="ok" no-data-text="aaa"></el-select>
    	<el-select placeholder="ok" no-data-text="bbb"></el-select>
    </client-only>
</template>