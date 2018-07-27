<template>
  <b-table id="GamesTable" :items="gamesProvider" :fields="fields">
    <template slot="tracked" slot-scope="row">
      <b-form-checkbox @click.native.stop @change="toggleGame(row.item.id, row.item.active)" v-model="row.item.active">
      </b-form-checkbox>
    </template>
    <template slot="date" slot-scope="data">
      <span>{{data.value | moment('LLLL')}}</span>
    </template>
    <template slot="matchup" slot-scope="row">
      <b-row>
        <b-img :src="row.item.awayLogo" width="25px" height="25px"></b-img>
        {{row.item.name}}
        <b-img :src="row.item.homeLogo" width="25px" height="25px"></b-img>
      </b-row>
    </template>
  </b-table>
</template>

<script>
  export default {
    data() {
      return {
        fields: ["tracked", "date", "matchup"]
      }
    },
    methods: {
      gamesProvider() {
        return this.$http.get('/api/games').then((response) => {
          return response.data;
        });
      },
      toggleGame(id, active) {
        this.$http.post('api/game/toggle', {
          id,
          active: !active
        });
      }
    }
  }

</script>

<style lang="scss">
  #GamesTable {
    .row {
      img {
        margin: 0 10px;
      }
    }
  }

</style>
