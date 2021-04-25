const area = document.getElementById('area');
const areaName = document.querySelector('.areaName');
const pupularArea = document.getElementById('popularArea');
const list = document.querySelector('.list');
const page = document.querySelector('.pagination');
let data = [];
let areaDataRecords = [];
let maxData;
let currentPage;

function init() {
  let xhr = new XMLHttpRequest;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let i = JSON.parse(xhr.responseText);
      let opiData = i.data.XML_Head.Infos.Info;
      data = opiData.slice(0);
      getList();
    }
  }

  xhr.open('GET', 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c', true);

  xhr.send();
}


function listRender(i, j) {
  let str = '';
  for(i; i <= j; i++) {
    str += `<li class="col-6 mb-5">
          <div class="card">
            <div class="d-flex justify-content-between align-items-end text-white px-3 pb-2" style="background: center/cover no-repeat url(${areaDataRecords[i].Picture1}); height:200px;">
              <h3 class="mb-0">${areaDataRecords[i].Name}</h3>
              <span>${areaName.textContent}</span>
            </div>
            <ul class="card-body d-flex justify-content-between list-unstyled">
              <li>
                <p><i class="fas fa-clock mr-2 text-success"></i>${areaDataRecords[i].Opentime}</p>
                <p><i class="fas fa-map-marker-alt text-info mr-2"></i>${areaDataRecords[i].Add}</p>
                <p class="mb-0"><i class="fas fa-mobile-alt text-primary mr-2"></i>${areaDataRecords[i].Tel}</p>
              </li>
              <div class="d-flex align-items-end flex-shrink-0">
                <p class="mb-0"><i class="fas fa-tags text-danger mr-2"></i>免費參觀</p>
              </div>
            </ul>
          </div>
        </li>`
  }
  list.innerHTML = str;
}

function paginationRender(currentPage) {
  let pageTotal = Math.ceil(maxData / 10);
  let str = '';
  
  if (currentPage > 1) {
    str += `<li class="page-item"><a class="page-link border-0" href="#">< prev</a></li>`;
  }

  for(let i = (pageTotal - currentPage > 10) ? currentPage : pageTotal - 10; i < Math.min(currentPage + 10, pageTotal); i++) {
    if (i == currentPage) {
      str += `<li class="page-item active"><a class="page-link border-0" href="#">${i}</a></li>`;
    }else {
      str += `<li class="page-item"><a class="page-link border-0" href="#">${i}</a></li>`;
    }
  }

  if (currentPage < pageTotal) {
    str += `<li class="page-item"><a class="page-link border-0" href="#">next ></a></li>`;
  }
  page.innerHTML = str;
}

function pageFilter(pageNum) {
  let i;
  let j;

  if (!isNaN(pageNum)) {
    // console.log(currentPage);
    // console.log(currentPage == pageNum);
    // if (currentPage == pageNum) {return;}
    currentPage = Number(pageNum);
    i = currentPage * 10 - 10;
    j = currentPage * 10 - 1;
    if (j > maxData) {
      j = maxData - 1;
    }
    listRender(i, j);
    paginationRender(currentPage);
  } else {
    switch (pageNum) {
      case "< prev":
        currentPage--;
        i = currentPage * 10 - 10;
        j = currentPage * 10 - 1;
        listRender(i, j)
        paginationRender(currentPage);
        break;
    
      case "next >":
        currentPage++;
        i = currentPage * 10 - 10;
        j = currentPage * 10 - 1;
        if (j > maxData) {
          j = maxData - 1;
        }
        listRender(i, j)
        paginationRender(currentPage);
        break;
    }
  }
}

function getList(select = "高雄市") {
  let initPage = 1;
  areaDataRecords = [];
  areaName.textContent = select;

  for(let i = 0; i < data.length; i++) {
    if (data[i].Add.includes(select)) {
      areaDataRecords.push(data[i]);
    }
  }
  maxData = areaDataRecords.length;
  pageFilter(initPage);
}

init();

area.addEventListener('change', (e) => {
  let select = e.target.value;
  getList(select);
}, false);

popularArea.addEventListener('click', (e) => {
  let select = e.target.textContent;
  if (e.target.nodeName === "DIV") {return;}
  getList(select);
}, false);

page.addEventListener('click', (e) => {
  e.preventDefault();
  let pageNum = e.target.textContent;
  pageFilter(pageNum);
}, false)


$(document).ready(function () {
  $(window).scroll(function (e) {
    let scrollPos = $(window).scrollTop();
    if (scrollPos > 150) {
      $('.goTop').addClass('goTopAnimated');
    } else{
      $('.goTop').removeClass('goTopAnimated');
    }
  })

  $('.goTop').click(function (e) {
  e.preventDefault();
  $('html, body').animate({
    scrollTop: 0,
    }, 500)
  })

})



