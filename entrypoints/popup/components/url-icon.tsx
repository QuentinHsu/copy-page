function URLIcon(props: { url: string, className?: string }) {
  let iconURL = ''
  const faviconUrl: string = `https://www.google.com/s2/favicons?sz=64&domain_url=${props.url}`
  if (props.url.startsWith('chrome://'))
    iconURL = ''
  else
    iconURL = faviconUrl

  return (
    iconURL === '' ? <div className={`w-4 rounded ${props.className}`}></div> : <img className={`w-4 rounded ${props.className}`} src={iconURL} alt="icon" />
  )
}
export default URLIcon
