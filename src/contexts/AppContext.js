// src/contexts/AppContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// URL FIXA DA API EM PRODUÇÃO, COM OVERRIDE OPCIONAL POR VARIÁVEL DE AMBIENTE
const API_URL =
  process.env.REACT_APP_API_URL ||
  'https://wedding-6pnopfkyu-bfrpaulondevs-projects.vercel.app/api';

export const WEDDING_DATE = new Date('2026-05-24T15:30:00+01:00');

export const DAILY_PHRASES = [
  'Somos feitos um para o outro',
  'Dois corações, uma só história',
  'O nosso para sempre começa aqui',
  'O amor sempre encontra um caminho',
  'Hoje, amanhã e sempre, nós',
];

export const AppProvider = ({ children }) => {
  // usuário autenticado (convidado)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc_user')) || null;
    } catch {
      return null;
    }
  });

  const [userToken, setUserToken] = useState(() => {
    try {
      return localStorage.getItem('cc_user_token') || null;
    } catch {
      return null;
    }
  });

  // admin (noivos)
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('cc_admin') === 'true';
    } catch {
      return false;
    }
  });

  const [adminToken, setAdminToken] = useState(() => {
    try {
      return localStorage.getItem('cc_admin_token') || null;
    } catch {
      return null;
    }
  });

  // RSVPs
  const [rsvps, setRsvps] = useState([]); // lista completa (admin)
  const [myRsvp, setMyRsvp] = useState(null); // RSVP do convidado atual

  // stubs para features antigas (ex: chá de cozinha)
  const [isKitchenUnlocked] = useState(false);
  const unlockKitchen = () => {};

  // --- Persistência em localStorage ---

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('cc_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('cc_user');
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      if (userToken) {
        localStorage.setItem('cc_user_token', userToken);
      } else {
        localStorage.removeItem('cc_user_token');
      }
    } catch {}
  }, [userToken]);

  useEffect(() => {
    try {
      localStorage.setItem('cc_admin', isAdmin ? 'true' : 'false');
    } catch {}
  }, [isAdmin]);

  useEffect(() => {
    try {
      if (adminToken) {
        localStorage.setItem('cc_admin_token', adminToken);
      } else {
        localStorage.removeItem('cc_admin_token');
      }
    } catch {}
  }, [adminToken]);

  // carregar RSVP do convidado a partir do ID guardado
  useEffect(() => {
    const id = localStorage.getItem('cc_my_rsvp_id');
    if (!id) return;
    refreshMyRsvp(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // se já for admin e tiver token, carregar lista sempre que mudar
  useEffect(() => {
    if (isAdmin && adminToken) {
      fetchAdminRsvps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, adminToken]);

  // --- Auth de convidado (Gate) ---

  const login = async (data) => {
    const name = (data?.name || '').trim() || 'Convidado';
    const email = (data?.email || '').toLowerCase().trim();
    const password = data?.pass || data?.password || '';

    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // 1. tenta registrar
    let res;
    try {
      res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
    } catch (err) {
      console.error('Erro de rede em register:', err);
      throw new Error('Não foi possível contactar o servidor');
    }

    if (res.ok) {
      const body = await res.json();
      setUser(body.user);
      setUserToken(body.token);
      return { mode: 'register', user: body.user };
    }

    // se não for conflito (email já existe), erro direto
    if (res.status !== 409) {
      let msg = 'Erro ao criar conta';
      try {
        const errBody = await res.json();
        if (errBody?.message) msg = errBody.message;
      } catch {}
      throw new Error(msg);
    }

    // 2. já existe → login
    let loginRes;
    try {
      loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      console.error('Erro de rede em login:', err);
      throw new Error('Não foi possível contactar o servidor');
    }

    if (!loginRes.ok) {
      let msg = 'Credenciais inválidas';
      try {
        const errBody = await loginRes.json();
        if (errBody?.message) msg = errBody.message;
      } catch {}
      throw new Error(msg);
    }

    const loginBody = await loginRes.json();
    setUser(loginBody.user);
    setUserToken(loginBody.token);
    return { mode: 'login', user: loginBody.user };
  };

  const logout = () => {
    try {
      localStorage.removeItem('cc_user');
      localStorage.removeItem('cc_user_token');
      localStorage.removeItem('cc_my_rsvp_id');
      localStorage.removeItem('cc_admin');
      localStorage.removeItem('cc_admin_token');
    } catch {}

    setUser(null);
    setUserToken(null);
    setIsAdmin(false);
    setAdminToken(null);
    setMyRsvp(null);
    setRsvps([]);
  };

  // --- Admin (noivos) ---

  const enterAdmin = async (code) => {
    if (!code) return false;

    let res;
    try {
      res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
    } catch (err) {
      console.error('Erro de rede em admin/login:', err);
      return false;
    }

    if (!res.ok) {
      console.error('Código admin inválido');
      return false;
    }

    const data = await res.json();
    setAdminToken(data.token);
    setIsAdmin(true);

    await fetchAdminRsvps(data.token);
    return true;
  };

  const exitAdmin = () => {
    setIsAdmin(false);
    setAdminToken(null);
    try {
      localStorage.setItem('cc_admin', 'false');
      localStorage.removeItem('cc_admin_token');
    } catch {}
  };

  // --- RSVP: convidados ---

  const addRsvp = async (payload) => {
    const body = {
      name: payload.name,
      guests: Number(payload.guests || 1),
      message: payload.message || '',
      dietary: payload.dietary || '',
    };

    let res;
    try {
      res = await fetch(`${API_URL}/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error('Erro de rede em POST /rsvps:', err);
      throw new Error('Não foi possível contactar o servidor');
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || 'Erro ao criar RSVP');
    }

    const created = await res.json();
    setMyRsvp(created);

    try {
      localStorage.setItem('cc_my_rsvp_id', created._id);
    } catch {}

    setRsvps((prev) => [created, ...(prev || [])]);

    return created;
  };

  const refreshMyRsvpFromStorage = async () => {
    const id = localStorage.getItem('cc_my_rsvp_id');
    if (!id) return null;
    return refreshMyRsvp(id);
  };

  const refreshMyRsvp = async (id) => {
    let res;
    try {
      res = await fetch(`${API_URL}/rsvps/${id}`);
    } catch (err) {
      console.error('Erro de rede em GET /rsvps/:id:', err);
      return null;
    }

    if (!res.ok) return null;

    const data = await res.json();
    setMyRsvp(data);
    return data;
  };

  // --- RSVP: admin ---

  const fetchAdminRsvps = async (tokenOverride) => {
    const token = tokenOverride || adminToken;
    if (!token) return [];

    let res;
    try {
      res = await fetch(`${API_URL}/admin/rsvps`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Erro de rede em GET /admin/rsvps:', err);
      return [];
    }

    if (!res.ok) {
      console.error('Erro ao carregar RSVPs admin');
      return [];
    }

    const list = await res.json();
    setRsvps(list);
    return list;
  };

  const updateRsvpStatus = async (id, status) => {
    if (!adminToken) {
      throw new Error('Admin não autenticado');
    }

    let res;
    try {
      res = await fetch(`${API_URL}/admin/rsvps/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error('Erro de rede em PATCH /admin/rsvps/:id/status:', err);
      throw new Error('Não foi possível contactar o servidor');
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || 'Erro ao atualizar status');
    }

    const updated = await res.json();

    setRsvps((prev) =>
      (prev || []).map((item) => (item._id === id ? updated : item)),
    );

    setMyRsvp((prev) => (prev && prev._id === id ? updated : prev));

    return updated;
  };

  const value = {
    user,
    userToken,
    login,
    logout,

    isAdmin,
    enterAdmin,
    exitAdmin,

    rsvps,
    myRsvp,
    addRsvp,
    fetchAdminRsvps,
    updateRsvpStatus,
    refreshMyRsvpFromStorage,

    isKitchenUnlocked,
    unlockKitchen,

    WEDDING_DATE,
    DAILY_PHRASES,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
