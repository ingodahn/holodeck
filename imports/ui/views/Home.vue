<template>
  <div class="container">
    <v-main>
      <h1>The MathTrek Holodeck</h1>
      <h2>Quick start</h2>
      <p>
        Start by selecting a book from the library which you can find under the
        <em>Home</em> menu. Click on the reading icon
        <v-icon>mdi-braille</v-icon> to start reading at cell 1 or continue
        reading where you left off. Navigate in the book using the arrows in the
        toolbar or the list of cells which appears when you click on the current
        cell number in the toolbar.
      </p>
      <p>
        Some cells contain executable code for making up
        calculations,visualizations, etc. You can edit and/or execute these
        cells. As some of these calculations may require data from previous
        calculations, it is a good idea to execute all these code cells in the
        sequence in which they occur in the book. The code in the cell is
        executed on a remote
        <a href="https://sagecell.sagemath.org/" target="_blank"
          >SageMathCell</a
        >
        server. The computational content is <em>not</em> maintained through
        longer periods of inactivity.
      </p>
      <h2>Color codes</h2>
      <p>
        The cell you are focussed on is marked with a colored bar on both of its
        sides.
      </p>
      <p></p>
      <p>
        For code cells,a green bar, indicates that this code cell has already
        been executed. Otherwise, the bar shall be orange - or red if the deck
        has detected that some required calculation has not been executed yet.
      </p>
      <h2>The Pinboard</h2>
      <p>
        The pinboard can keep the current state of your current cell for later
        reference, also across sessions. The pin icon in the toolbar puts your
        current cell on the pinboard.
      </p>
      <h2>Working with multiple books</h2>
      <p>
        You can open as many books as you want in the same Holodeck. However,
        for frequent switch between books or between a book and the pinboard,
        you can open a book in a temporary Holodeck by clicking on the New Deck
        icon <v-icon>mdi-new-box</v-icon> in the library.
      </p>
      <p>
        <b>Important:</b> Changes in temporary decks are not maintained across
        sessions. The icon
        <v-icon color="warning">mdi-content-save-off</v-icon> in the toolbar
        indicates, that the deck is temporary.
      </p>
      <h2>Personalizing the Holodeck</h2>
      <p>
        Under <em>Settings</em> in the main menu you you ca determine, how many
        cells before or after your current cells are shown and the level of
        detail of the navigation menu
      </p>
      <p>
        <b>Tip:</b> While you can have all cells of a book on the same page,
        this page can become quite large and it may not open at your current
        cell since external content is loaded with delay, shifting other parts
        of the page around. In any case, you can go to your current cell by
        clicking on the icon <v-icon>mdi-map-marker-check-outline</v-icon> on
        the toolbar.
      </p>
    </v-main>
  </div>
</template>

<script>
export default {
  components: {},
};
</script>