;(function () {
  "use strict"

  var STORAGE_KEY = "quartz-eink-mode"
  var READER_STORAGE_KEY = "quartz-reader-mode"
  var root = document.documentElement

  function readSavedMode() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "on"
    } catch (_) {
      return false
    }
  }

  function saveMode(enabled) {
    try {
      window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off")
    } catch (_) {}
  }

  function readReaderMode() {
    try {
      return window.sessionStorage.getItem(READER_STORAGE_KEY) === "on"
    } catch (_) {
      return false
    }
  }

  function saveReaderMode(enabled) {
    try {
      window.sessionStorage.setItem(READER_STORAGE_KEY, enabled ? "on" : "off")
    } catch (_) {}
  }

  function requestedByUrl() {
    try {
      return new URL(window.location.href).searchParams.get("theme") === "eink"
    } catch (_) {
      return false
    }
  }

  function updateButtons(enabled) {
    var buttons = document.querySelectorAll("[data-eink-toggle]")
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("aria-pressed", String(enabled))
      buttons[i].title = enabled ? "退出墨水屏模式" : "进入墨水屏模式"
    }
  }

  function setMode(enabled) {
    root.setAttribute("data-eink-mode", enabled ? "on" : "off")
    saveMode(enabled)
    updateButtons(enabled)
    updatePagerState()
  }

  function toggleMode() {
    setMode(root.getAttribute("data-eink-mode") !== "on")
  }

  var readerModeEnabled = readReaderMode()

  function setReaderMode(enabled) {
    readerModeEnabled = enabled
    root.setAttribute("reader-mode", enabled ? "on" : "off")
    saveReaderMode(enabled)
    document.dispatchEvent(
      new CustomEvent("readermodechange", { detail: { mode: enabled ? "on" : "off" } }),
    )
  }

  function pageStep(direction) {
    var overlap = Math.max(48, Math.round(window.innerHeight * 0.1))
    var distance = Math.max(1, window.innerHeight - overlap)
    window.scrollTo(0, Math.max(0, window.scrollY + direction * distance))
  }

  function updatePagerState() {
    var up = document.querySelector("[data-eink-page='up']")
    var down = document.querySelector("[data-eink-page='down']")
    if (!up || !down) return

    var maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    up.disabled = window.scrollY <= 1
    down.disabled = window.scrollY >= maxScroll - 1
  }

  function exitReaderMode() {
    setReaderMode(false)
  }

  function makeButton(className, label, title) {
    var button = document.createElement("button")
    button.type = "button"
    button.className = className
    button.textContent = label
    button.title = title
    button.setAttribute("aria-label", title)
    return button
  }

  function ensureInlineToggle() {
    if (document.querySelector(".eink-mode-toggle-inline")) return

    var readerButton = document.querySelector(".readermode")
    if (!readerButton || !readerButton.parentElement) return

    var toggle = makeButton("eink-mode-toggle-inline", "墨水屏", "进入墨水屏模式")
    toggle.setAttribute("data-eink-toggle", "")
    toggle.addEventListener("click", toggleMode)
    readerButton.insertAdjacentElement("afterend", toggle)
  }

  function manageReaderButtons() {
    var buttons = document.querySelectorAll(".readermode")
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i]
      if (button.hasAttribute("data-eink-reader-managed")) continue

      button.setAttribute("data-eink-reader-managed", "")
      button.addEventListener(
        "click",
        function (event) {
          event.preventDefault()
          event.stopImmediatePropagation()
          setReaderMode(!readerModeEnabled)
        },
        true,
      )
    }
  }

  function fixHomeLink() {
    var home = document.querySelector(".breadcrumb-container .breadcrumb-element:first-child a")
    if (home && typeof window.__quartzUrl === "function") {
      home.href = window.__quartzUrl("")
    }
  }

  function ensureDock() {
    if (document.getElementById("eink-controls")) return

    var dock = document.createElement("nav")
    dock.id = "eink-controls"
    dock.className = "eink-controls"
    dock.setAttribute("aria-label", "墨水屏阅读控制")

    var exitReader = makeButton("eink-control eink-exit-reader", "退出阅读", "退出阅读模式")
    exitReader.addEventListener("click", exitReaderMode)

    var up = makeButton("eink-control eink-page-control", "上翻", "向上翻一屏")
    up.setAttribute("data-eink-page", "up")
    up.addEventListener("click", function () {
      pageStep(-1)
    })

    var down = makeButton("eink-control eink-page-control", "下翻", "向下翻一屏")
    down.setAttribute("data-eink-page", "down")
    down.addEventListener("click", function () {
      pageStep(1)
    })

    var toggle = makeButton("eink-control eink-dock-mode-toggle", "退出墨水屏", "退出墨水屏模式")
    toggle.setAttribute("data-eink-toggle", "")
    toggle.addEventListener("click", toggleMode)

    dock.appendChild(exitReader)
    dock.appendChild(up)
    dock.appendChild(down)
    dock.appendChild(toggle)
    document.body.appendChild(dock)
  }

  function setupPage() {
    manageReaderButtons()
    ensureInlineToggle()
    ensureDock()
    fixHomeLink()
    root.setAttribute("reader-mode", readerModeEnabled ? "on" : "off")
    updateButtons(root.getAttribute("data-eink-mode") === "on")
    updatePagerState()
  }

  function handleKeydown(event) {
    if (root.getAttribute("data-eink-mode") !== "on") return
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return

    var target = event.target
    if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))
      return

    if (event.key === "PageUp") {
      event.preventDefault()
      pageStep(-1)
    } else if (event.key === "PageDown") {
      event.preventDefault()
      pageStep(1)
    }
  }

  var initialMode = requestedByUrl() || readSavedMode()
  root.setAttribute("data-eink-mode", initialMode ? "on" : "off")
  root.setAttribute("reader-mode", readerModeEnabled ? "on" : "off")
  if (requestedByUrl()) saveMode(true)

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupPage, { once: true })
  } else {
    setupPage()
  }

  document.addEventListener("nav", function () {
    window.requestAnimationFrame(setupPage)
  })
  document.addEventListener("render", function () {
    window.requestAnimationFrame(setupPage)
  })
  document.addEventListener("keydown", handleKeydown)
  window.addEventListener("scroll", updatePagerState, { passive: true })
  window.addEventListener("resize", updatePagerState, { passive: true })
})()
