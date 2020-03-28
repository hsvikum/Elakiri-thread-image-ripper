

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<p align="center">
  <h3 align="center">Elakiri Thread Image Ripper</h3>
  <p align="center">
    Cli Tool To Extract Images From Elakiri.com Threads
    <br />
    <a href="https://github.com/hsvikum/Elakiri-thread-image-ripper/issues">Report Bug</a>
    ·
    <a href="https://github.com/hsvikum/Elakiri-thread-image-ripper/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

Elakiri.com is filled with awsome threads.Specially some with grate images.But it's a hassel to go through each page reading through comment after comment just to find the next image 3 pages later.

This project exsists because:
* I'm too lazy and sleepy to go through 100's of pages at 2 AM in the morning :smile:.
* Needed to try out Puppeteer for some automation work and have a reference code i can look up.

Hope others facing similar issue will find this tool usefull.

### Built With
* [Puppeteer](https://github.com/puppeteer/puppeteer)
* [NodeJs](https://nodejs.org)



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

:vertical_traffic_light: To get this project running you need the following
* NodeJS (Tested with and recommends NodeJS 12)
* NPM 

### Installation

1. Clone the repo
```sh
git clone https://github.com/hsvikum/Elakiri-thread-image-ripper.git
```
2. Install NPM packages
```sh
npm install
```
3. Run `index.js` with node
```sh
node index.js <ThreadId> <PageNumberToStart> <showBrowser>
```
<!-- USAGE EXAMPLES -->
## Usage
Example Url: _http://www.elakiri.com/forum/showthread.php?t=1880473&page=3_

Ex 1: To download images from the first page of the post you run as
```sh
node index.js 1880473
```

Ex 2: To download images from the third page of the post you run as
```sh
node index.js 1880473 3
```

Ex 3: To download images from the third page of the post while inspecting the actual page naviagation run as
```sh
node index.js 1880473 3 true
```

<!-- ROADMAP -->
## Roadmap
:checkered_flag: See the [open issues](https://github.com/hsvikum/Elakiri-thread-image-ripper/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

:construction: Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See also the list of [contributors](https://github.com/hsvikum/Elakiri-thread-image-ripper/contributors) who participated in this project.

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/hsvikum/Elakiri-thread-image-ripper](https://github.com/hsvikum/Elakiri-thread-image-ripper)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Puppeteer](https://github.com/puppeteer/puppeteer)
* [file-type](https://github.com/sindresorhus/file-type)
* [cli-color](https://github.com/medikoo/cli-color)
* [axios](https://github.com/axios/axios)
* [Best-README-Template](https://github.com/hsvikum/Best-README-Template)

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/hsvikum/Elakiri-thread-image-ripper.svg?style=flat-square
[contributors-url]: https://github.com/hsvikum/Elakiri-thread-image-ripper/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/hsvikum/Elakiri-thread-image-ripper.svg?style=flat-square
[forks-url]: https://github.com/hsvikum/Elakiri-thread-image-ripper/network/members
[stars-shield]: https://img.shields.io/github/stars/hsvikum/Elakiri-thread-image-ripper.svg?style=flat-square
[stars-url]: https://github.com/hsvikum/Elakiri-thread-image-ripper/stargazers
[issues-shield]: https://img.shields.io/github/issues/hsvikum/Elakiri-thread-image-ripper.svg?style=flat-square
[issues-url]: https://github.com/hsvikum/Elakiri-thread-image-ripper/issues
[license-shield]: https://img.shields.io/github/license/hsvikum/Elakiri-thread-image-ripper.svg?style=flat-square
[license-url]: https://github.com/hsvikum/Elakiri-thread-image-ripper/blob/master/LICENSE.txt
