export function getClientIp(headers: Headers) {
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip") || headers.get("cf-connecting-ip");
  if (realIp) {
    return realIp.trim();
  }

  return undefined;
}

export function trimIp(ip?: string) {
  if (!ip) return undefined;
  let result = ip.trim().toLowerCase();
  if (result.startsWith("::ffff:")) {
    result = result.substring(7);
  }
  return result;
}
