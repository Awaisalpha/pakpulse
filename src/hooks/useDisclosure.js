import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

// Open/close logic for a button that shows and hides a panel
// (the "disclosure" pattern), e.g. the Explore dropdown or the mobile menu.
//
// Returns:
//   isOpen     – true while the panel is shown
//   toggle     – call from the button's onClick
//   close      – call to hide the panel (e.g. after a link is clicked)
//   closeAndReturnFocus – hide the panel AND put focus back on the button
//                (e.g. after choosing a link inside the panel)
//   areaRef    – put on the element that wraps BOTH the button and the panel
//   buttonRef  – put on the button, so focus can go back to it
//   panelRef   – optional: put on the panel; focus then moves to its first link
//                or button when it opens (used by the explorer's mobile menu)
//
// While open, the panel closes when you press Escape, click outside the area,
// Tab out of the area, or go to another page.
export function useDisclosure() {
  const location = useLocation()
  const currentUrl = location.pathname + location.hash

  // We remember WHICH page the panel was opened on (or null when closed).
  // If the URL changes, it no longer matches, so the panel counts as closed
  // without any extra code.
  const [openedOnUrl, setOpenedOnUrl] = useState(null)
  const isOpen = openedOnUrl === currentUrl

  const areaRef = useRef(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)

  function toggle() {
    setOpenedOnUrl(isOpen ? null : currentUrl)
  }

  function close() {
    setOpenedOnUrl(null)
  }

  function closeAndReturnFocus() {
    setOpenedOnUrl(null)
    buttonRef.current?.focus()
  }

  // When the panel opens, move focus into it (only if a panelRef was attached)
  useEffect(() => {
    if (isOpen) panelRef.current?.querySelector('a, button')?.focus()
  }, [isOpen])

  // Listen for Escape, outside clicks and focus leaving — only while open
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenedOnUrl(null)
        buttonRef.current?.focus() // give focus back to the button
      }
    }

    function handlePointerDown(event) {
      // Clicks inside the area (button or panel) are handled by them
      if (!areaRef.current?.contains(event.target)) setOpenedOnUrl(null)
    }

    function handleFocusIn(event) {
      // Focus moved to something outside the area, e.g. by pressing Tab
      if (!areaRef.current?.contains(event.target)) setOpenedOnUrl(null)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('focusin', handleFocusIn)

    // Cleanup: remove the listeners when the panel closes
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('focusin', handleFocusIn)
    }
  }, [isOpen])

  return { isOpen, toggle, close, closeAndReturnFocus, areaRef, buttonRef, panelRef }
}
