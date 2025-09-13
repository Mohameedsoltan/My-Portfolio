import { openImageOverlay, closeImageOverlay, getOverlayState, clickNavButton } from "../controllers/main-controllers.js";
import certificates from "../models/certificates.js";
import skills from "../models/skills.js";
import projects from "../models/projects.js";

activateNavButtons();
renderCertificates(certificates);
renderSkills(skills);
activateProjectsNavButtons();
renderProjects('all');

initializeImageOverlay();
makeImagesClickable();

function activateNavButtons() {
  const navButtons = document.querySelectorAll('.nav-link-js');

  navButtons.forEach(link => {
    link.addEventListener('click', () => clickNavButton(link, navButtons));
  });
}

function renderCertificates(certificates) {
  const DomFigures = certificates.map(certificate => {
    return `<figure class="figure-item">
                <img class="image-click image-click-js" src="${certificate.imgSrc}" alt="${certificate.imgAlt} draggable="false" loading="lazy">
                <figcaption>
                  <h3>${certificate.title}</h3>
                  <small>${certificate.smallInfo}</small>
                </figcaption>
            </figure>`;
  }).join('');

  document.querySelector('.certificates-list-js').innerHTML = DomFigures;
}

function renderSkills(skills) {
  const DomWebSkills = skills.map(skill => {
    if (skill.category === 'web-development')
      return `
      <li class="skill-item" id="${skill.id}"><img src="${skill.imgSrc}" alt="${skill.imgAlt}" draggable="false"> ${skill.title}</li>
    `;
  }).join('');

  document.querySelector('.skill-items-js#web-development-skills ul').innerHTML = DomWebSkills;
}

function activateProjectsNavButtons() {
  const navButtons = document.querySelectorAll('.my-work-filter-btn-js');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      clickNavButton(button, navButtons);
      setTimeout(() => renderProjects(button.dataset.category), 350);
      document.querySelectorAll('.figure-item-js').forEach(figure => {
        figure.classList.add('fade-out');
      });
    });
  });
}

function renderProjects(category = 'all') {
  const rightProjects = category === 'all' ? projects : projects.filter(project => project.category === category);

  const rightProjectsDom = [];

  rightProjects.forEach(project => {
    let projectSkills = [];
    project.skillsId.forEach(skillId => {
      projectSkills.push(skills.find(skill => skill.id === skillId));
    });
    rightProjectsDom.push(`
    <li class="project-list-item">
      <figure class="figure-item figure-item-js">
        <img src="${project.imgSrc}" class="image-click image-click-js"
          alt="${project.imgAlt}" draggable="false" loading="lazy">
        <figcaption>
          <h3>${project.title}</h3>
          <small>${project.info}</small>
          <ul class="project-skills">
            ${projectSkills.map(skill => `<li class="skill-item" id="${skill.id}"><img src="${skill.imgSrc}" alt="${skill.imgAlt}" draggable="false"> ${skill.title}</li>`).join('')}
          </ul >
        </figcaption >
      </figure >
    </li >
  `)
  });

  document.querySelector('.projects-list-js').innerHTML = rightProjectsDom.join('') || '<p>Empty.</p>';
  makeImagesClickable();
}

function initializeImageOverlay() {
  const overlay = document.getElementById('imageOverlay');
  const closeBtn = document.getElementById('closeBtn');

  if (!overlay) {
    console.error('Overlay HTML structure not found.');
    return;
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeImageOverlay);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeImageOverlay();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (getOverlayState() && e.key === 'Escape') {
      closeImageOverlay();
    }
  });

  window.addEventListener('popstate', (e) => {
    if (getOverlayState()) {
      closeImageOverlay();
    }
  });
}

function makeImagesClickable(imageSelector = '.image-click-js') {
  const images = document.querySelectorAll(imageSelector);

  images.forEach(img => {
    img.removeEventListener('click', handleImageClick);
    img.addEventListener('click', handleImageClick);
    img.style.cursor = 'pointer';
  });
}

function handleImageClick(e) {
  const img = e.target;
  openImageOverlay(img.src, img.alt);
}