# Estuary

Visualizes the story an artifact takes in the Red Hat build to release pipeline.

## Development

### Prerequisites

The versions listed below are the one which were tested and work. Other versions
can work as well.

* Install docker version 20.10.5
* Install docker-compose version 1.28.5

To setup a local development environment:

* Invoke the command: ```make up```

## Run the Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Adding an SVG Icon to the Font

The "estuary-icons" font is generated using [IcoMoon](http://icomoon.io/app).

To modify the fonts:
* Navigate to the [IcoMoon projects page](https://icomoon.io/app/#/projects)
* Click on "Import Project"
* Select `estuary-icomoon.json` from the root of the repo
* Click "Load" next to the loaded project called "Estuary"
* You'll now be at a page that shows the "Estuary" icon set
* Click on the hamburger button associated with the "Estuary" icon set and click on "Import to Set"
* Select the SVG you want to add and now your SVG will appear in the "Estuary" icon set
* Select the new icon in the "Estuary" icon set
* Click on "Generate Font"
* Click on the "Download" button and this will download a zip file with a "fonts" folder with four files
* Rename all those font files to be `estuary-icons.*` instead of `icomoon.*`
* Replace the "icomoon" ID with "estuary-icons" in the "estuary-icons.svg" file
* Add an entry in `src/styles.css` for your new icon as such (replacing `freshmaker` with your icon
  name and `\e901` with the actual character code):
  ```css
  .estuary-icon-freshmaker:before {
      content: "\e901";
  }
  ```
* Replace the font files in `src/assets/fonts` with the new files
* The new icon will now be ready to be used by using the class defined above
* Once you've tested things work properly, generate the updated JSON by going to the
  IcoMoon projects page](https://icomoon.io/app/#/projects) and clicking on "Download"
  next to the "Estuary" icon set
* Replace `estuary-icomoon.json` with the updated JSON file
