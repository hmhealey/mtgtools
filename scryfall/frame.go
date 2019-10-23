package scryfall

type FrameEffect string

const (
	FrameLegendary             FrameEffect = "legendary"
	FrameMiracle                           = "miracle"
	FrameNyxTouched                        = "nyxtouched"
	FrameDraft                             = "draft"
	FrameDevoid                            = "devoid"
	FrameTombstone                         = "tombstone"
	FrameColorshifted                      = "colorshifted"
	FrameSunMoonDFC                        = "sunmoondfc"
	FrameCompassLandDFC                    = "compasslanddfc"
	FrameOriginPlaneswalkerDFC             = "originpwdfc"
	FrameMoonEldraziDFC                    = "mooneldrazidfc"
)

type Frame string

const (
	Frame1993   Frame = "1993"
	Frame1997         = "1997"
	Frame2003         = "2003"
	Frame2015         = "2015"
	FrameFuture       = "future"
)
