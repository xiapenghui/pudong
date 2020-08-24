import mapUtils from './mapUtils'

let types = []
let vm = null

function SearchControl ({ left = 0, top = 0, searchTypes = [] }, vueInstance) {
  this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT
  types = searchTypes
  vm = vueInstance
}

SearchControl.prototype = new BMap.Control()
SearchControl.prototype.initialize = function (map) {
  const searchBar = document.createElement('div')
  searchBar.setAttribute('id', 'searchBar')
  const controlBar = document.getElementById('controlBar')
  let width = '100%'
  let height = '60px'
  if (controlBar) {
    width = `${controlBar.offsetWidth}px`
    const controlHeight = controlBar.offsetHeight
    const controlTop = controlBar.offsetTop
    const controlLeft = controlBar.offsetLeft
    height = `${controlHeight / 3 * 2}px`
    this.defaultOffset = new BMap.Size(controlLeft, controlHeight + controlTop + 15)
  }
  searchBar.style.width = width
  searchBar.style.height = height
  searchBar.style.backgroundColor = 'rgba(59,130,177,.28)'

  if (types.length > 0) {
    const searchTypeSelect = document.createElement('select')
    searchTypeSelect.setAttribute('id', 'searchType')
    searchTypeSelect.style.position = 'absolute'
    searchTypeSelect.style.left = '0'
    searchTypeSelect.style.top = '0'
    searchTypeSelect.style.height = height
    searchTypeSelect.style.lineHeight = height
    searchTypeSelect.style.padding = '0 20px'
    searchTypeSelect.style.background = 'none'
    searchTypeSelect.style.border = 'none'
    searchTypeSelect.style.color = 'rgba(255,255,255,.6)'

    // 先添加默认
    const option = document.createElement('option')
    option.setAttribute('value', 'default')
    option.innerHTML = '地点'
    option.style.backgroundColor = 'rgb(7, 49, 90)'
    searchTypeSelect.appendChild(option)

    types.forEach(type => {
      const option = document.createElement('option')
      option.setAttribute('value', type.name)
      option.innerHTML = type.text
      option.style.backgroundColor = 'rgb(7, 49, 90)'
      searchTypeSelect.appendChild(option)
    })
    searchBar.appendChild(searchTypeSelect)
  }

  const searchInput = document.createElement('input')
  searchInput.setAttribute('id', 'searchInput')
  searchInput.setAttribute('type', 'text')
  searchInput.style.background = 'none'
  searchInput.style.width = types.length > 0 ? '780px' : '1030px'
  searchInput.style.height = height
  searchInput.style.marginLeft = types.length > 0 ? '250px' : '0'
  searchInput.style.borderWidth = '0'
  searchInput.style.color = 'rgba(255,255,255,.9)'
  searchInput.style.paddingLeft = '20px'
  searchBar.appendChild(searchInput)
  searchInput.addEventListener('keyup', evt => {
    if (evt.key && evt.key.toUpperCase() === 'ENTER') {
      search(map)
    }
  })

  const searchBtn = document.createElement('span')
  searchBtn.setAttribute('id', 'searchBtn')
  searchBtn.innerHTML = `<i class='iconfont icon-chaxun' style='color:rgba(255,255,255,.7);font-size:32px;cursor:pointer' title='搜索'></i>`
  searchBtn.style.padding = '8px 0'
  searchBtn.addEventListener('click', () => search(map))

  const searchResult = document.createElement('div')
  searchResult.setAttribute('id', 'searchResultContainer')
  searchResult.setAttribute('class', 'searchResult')
  searchResult.innerHTML = '<ul></ul>'
  searchResult.style.display = 'none'
  searchBar.appendChild(searchResult)

  map.getContainer().appendChild(searchBar)
  return searchBar
}

function search (map) {
  let searchType = document.getElementById('searchType')
  let searchTypeName = 'default'
  if (searchType) {
    searchTypeName = searchType.value
  }

  const keywords = document.getElementById('searchInput').value
  if (keywords.trim().length === 0) {
    return
  }
  const emptyResult = '<li><a  href="javascript:void(0);">无结果</a></li>'
  if (searchTypeName === 'default') {
    const local = new BMap.LocalSearch(map, {
      onSearchComplete: function (results) {
        let resultList = []
        let resultObjects = {}
        // 判断状态是否正确
        if (local.getStatus() === BMAP_STATUS_SUCCESS) {
          for (let i = 0; i < results.getCurrentNumPois(); i++) {
            const poi = results.getPoi(i)
            resultList.push(`<li>
                      <a data-result-id="${poi.uid}" href="javascript:void(0);">${poi.title}：${poi.address}</a>
                    </li>`)
            resultObjects[poi.uid] = poi
          }
        }
        if (resultList.length === 0) {
          resultList.push(emptyResult)
        }
        const searchResultContainer = document.getElementById('searchResultContainer')
        const searchResultList = searchResultContainer.getElementsByTagName('ul')[0]
        searchResultList.innerHTML = resultList.join('')
        searchResultContainer.style.display = 'block'
        document.querySelectorAll('.searchResult ul a').forEach(tag => {
          tag.addEventListener('click', e => {
            const id = e.currentTarget.dataset.resultId
            let resultObj = resultObjects[id]
            if (resultObj) {
              const resultPoint = new BMap.Point(resultObj.point.lng,
                resultObj.point.lat)
              const marker = mapUtils.appendMarker(map, resultPoint, null)
              const infoBox = mapUtils.showInfoWindow(marker, {}, [
                {
                  field: 'title',
                  title: '名称',
                }, {
                  field: 'address',
                  title: '地址',
                }, {
                  field: 'detailUrl',
                  title: '详情',
                  render: value => {
                    return value
                      ? `<a href="${value}" target="_blank">查看</a>`
                      : '无'
                  },
                }], [resultObj])
              infoBox.addEventListener('close', function (e) {
                map.removeOverlay(marker)
              })
              map.panTo(resultPoint, { noAnimation: true })
            }
          })
        })
      },
    })
    local.search(keywords)
  } else {
    vm.$emit('map-searching', searchTypeName, keywords, callback)
  }

  function callback (result) {
    let resultList = []
    let resultObjects = {}
    if (result && result.length > 0) {
      result.forEach(item => {
        resultList.push(`<li>
                      <a data-result-id="${item.id}" href="javascript:void(0);">${item.name}：${item.info}</a>
                    </li>`)
        resultObjects[item.id] = item
      })
    }
    if (resultList.length === 0) {
      resultList.push(emptyResult)
    }
    const searchResultContainer = document.getElementById('searchResultContainer')
    const searchResultList = searchResultContainer.getElementsByTagName('ul')
    searchResultList.innerHTML = resultList.join('')
    searchResultContainer.style.display = 'block'
    const results = document.querySelectorAll('.searchResult ul a')
    results.forEach(tag => {
      tag.addEventListener('click', e => {
        const id = e.currentTarget.dataset.resultId
        let resultObj = resultObjects[id]
        if (resultObj) {
          mapUtils.locate(map, {
            position: [
              resultObj.jd || resultObj.lng,
              resultObj.wd || resultObj.lat],
            data: searchTypeName + 'Marker' + id,
            showDetail: true,
          })
        }
      })
    })
  }
}

export default SearchControl