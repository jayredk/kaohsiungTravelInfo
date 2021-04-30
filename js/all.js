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
  fetch('https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c')
  .then(res => res.json())
  .then(opidata => {
    data = opidata.data.XML_Head.Infos.Info;
    getList();
  });
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
  let lowerPage;
  let upperPage;
  let str = '';
  if (currentPage > 1) {
    str += `<li class="page-item"><a class="page-link border-0" href="#">< prev</a></li>`;
  }
  // 畫面限制顯示 10 頁，超過 10 頁爲一種顯示方式，其餘爲一種
  if (pageTotal >= 10) {
    if (currentPage > 5) {
      if ((currentPage + 5) < pageTotal) {
        lowerPage = currentPage - 5;
      upperPage = currentPage + 4;
      } else {
        lowerPage = pageTotal - 9;
        upperPage = pageTotal;
      }
    } else {
    lowerPage = 1;
    upperPage = 10;
    }
  } else {
    lowerPage = 1;
    upperPage = pageTotal;
  }

  for(let i = lowerPage; i <= upperPage; i++) {
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
  let i;    //從第幾筆資料開始
  let j;    //到第幾筆資料結束

  if (!isNaN(pageNum)) {
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



