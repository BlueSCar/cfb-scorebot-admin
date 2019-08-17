<template>
    <b-container>
            <b-row>
                <b-col sm='12'>
                    <b-card title='Login with Discord:' class='shadow-lg'>
                        <b-link href='/auth/discord' class='discord-icon'>
                            <font-awesome-icon :icon="['fab', 'discord']" size='3x'></font-awesome-icon>
                        </b-link>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
</template>

<script>
export default {
}
</script>

<style>
    .discord-icon {
        color: #7289da;
    }
</style>
