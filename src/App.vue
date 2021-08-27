<template>
    <div id="app">
        <navigation :profile='profile'></navigation>
        <router-view v-if='!isLoading && profile' :profile='profile' />
        <login-panel v-if='!isLoading && !profile' />
        <div class='spinner-container' v-if='isLoading'>
            <b-spinner variant="primary" label="Spinning" style="width: 5em; height: 5em;" />
        </div>
    </div>
</template>

<script>
    import Navigation from '@/components/Navigation.vue';
    import LoginPanel from '@/components/LoginPanel.vue';
    export default {
        components: {
            Navigation,
            LoginPanel
        },
        data() {
            return {
                profile: null,
                isLoading: false
            };
        },
        methods: {
            fetchProfile() {
                this.$axios.get('/api/profile').then((result) => {
                    this.profile = result.data;
                    this.isLoading = false;

                    this.$axios.get('/api/discord/guilds').then((guildsResult) => {
                        this.profile.guilds = guildsResult.data;
                    });
                }).catch(err => {
                    this.profile = null;
                    this.isLoading = false;
                }).finally(() => {
                    this.isLoading = false;
                });
            }
        },
        created() {
            this.isLoading = true;
            this.fetchProfile();
        }
    };
</script>


<style lang="scss">
    body {
        background: url('./assets/bg.jpg') no-repeat scroll;
        background-attachment: fixed;
    }

    .spinner-container {
        margin-top: 4em;
    }

    div[class*="col-"],
    .col {
        margin-top: 2em;
    }

    .bottom-row {
        margin-bottom: 2em;
    }

    .page-container {
        margin-top: 2em;

        .title-card {
            .row {
                margin-bottom: 0;
            }

            div[class*="col-"],
            .col {
                margin-top: 0;
            }
        }
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        background: rgba(255, 255, 255, .5);
        height: 100%;
        padding-bottom: 15em;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }

</style>
