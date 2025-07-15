import type { SocialProps } from "../../interfaces/SocialProps";

export function Social({ url, children }: SocialProps){
  return(
    <a
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}