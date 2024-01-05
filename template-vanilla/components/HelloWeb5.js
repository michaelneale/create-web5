import { setupWeb5, web5, did, queryRecords, queryProtocols } from '../web5-utils.js';

export function HelloWeb5() {
  return `
    <header>
      <img width="192" src="../tbd.svg" class="logo" alt="TBD yellow curly braces icon" />
      <h1>Hello, <span>Web5!</span></h1>
    </header>
    <main>
      <div id="card">
          <button id="connect">Connect me to Web5</button>
          <div id="list"></div>
        <p>Use the starter functions in <code>web5-utils.js</code> to build your Web5 app. 
        Edit the template in <code>components/HelloWeb5.js</code> to modify this page.</p>
      </div>
      <p>
        Learn more about Web5 from the <a href="https://developer.tbd.website/docs/web5/" target="_blank">TBD Developer Docs</a>
      </p>
    </main>
  `
}

export async function handleStateOnLoad() {
  if (localStorage.getItem('userExists')) {
    await renderUI()
  } else {
    document.querySelector('#connect').addEventListener('click', async(e) => {
      await renderUI()
    })
  }
}

async function renderUI() {
  const { web5Stats } = await addWeb5();
  await addWeb5StatsList(web5Stats);
}

async function addWeb5() {
  const button = document.querySelector('#connect');
  button.textContent = "Connecting...";
  button.disabled = true;
  await setupWeb5();
  localStorage.setItem('userExists', true)
  button.textContent = "Connected";
  return {
    web5Stats: {
      "User DID: ": did,
      "Records stored: ": (await queryRecords()).length,
      "Protocols installed: ": (await queryProtocols()).length,
      "Local DWN location: ": 'Browser Storage > <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API">IndexedDB</a>',
      "Remote DWN location: ": (await web5.did.resolve(did)).didDocument.service.find(service => service.id === "#dwn").serviceEndpoint.nodes.join(', ')
    }
  }
}

async function addWeb5StatsList(web5Stats) {
  const list = document.querySelector('#list');
  const renderListItems = () => {
      let listItems = ``;
      for (const stat in web5Stats) {
        listItems += `
          <li>
            <p>
              <span>${stat}</span>
              ${web5Stats[stat]}
            </p>
          </li>
        `
      }
      return listItems
    }
  list.innerHTML = `<ul> ${renderListItems()} </ul>`;
}