package croner

import "openctfbackend/ent"

type ServiceClient interface {
	GetEnt() *ent.Client
}

type Handler struct {
	ServiceClient ServiceClient
}

func New(serviceClient ServiceClient) *Handler {
	return &Handler{
		ServiceClient: serviceClient,
	}
}
