<template>
    <b-container class='page-container'>
        <b-card class='title-card shadow-lg'>
            <b-row class='justify-content-between'>
                <b-col>
                    <h1>CFB Scorebot Admin</h1>
                </b-col>
            </b-row>
        </b-card>
        <guilds :guilds='profile.guilds' />
    </b-container>
</template>

<script>
    import Guilds from '@/components/Guilds.vue';

    export default {
        props: ['profile'],
        components: {
            Guilds
        }
    }

</script>

<style lang='scss'>

</style>
