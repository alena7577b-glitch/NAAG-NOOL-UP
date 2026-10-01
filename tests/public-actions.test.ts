import { submitCommunitySignup, submitContactInquiry } from '@/lib/actions/public';
import { db } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  db: {
    communitySignup: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    contactSubmission: {
      create: jest.fn(),
    },
  },
}));

describe('Phase 5 Public Actions Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('submitCommunitySignup', () => {
    test('successfully signs up a new community member', () => {
      (db.communitySignup.findUnique as jest.Mock).mockResolvedValue(null);
      (db.communitySignup.create as jest.Mock).mockResolvedValue({
        id: 'signup-1',
        fullName: 'Fadumo Warsame',
        email: 'fadumo@example.com',
        marketingConsent: true,
      });

      const formData = new FormData();
      formData.set('fullName', 'Fadumo Warsame');
      formData.set('email', 'fadumo@example.com');
      formData.set('marketingConsent', 'on');

      return submitCommunitySignup(null, formData).then((res) => {
        expect(res.success).toBe(true);
        expect(res.message).toContain("You're in");
        expect(db.communitySignup.create).toHaveBeenCalledWith({
          data: {
            fullName: 'Fadumo Warsame',
            email: 'fadumo@example.com',
            marketingConsent: true,
          },
        });
      });
    });

    test('handles already registered community member gracefully', () => {
      (db.communitySignup.findUnique as jest.Mock).mockResolvedValue({
        id: 'signup-existing',
        email: 'fadumo@example.com',
      });

      const formData = new FormData();
      formData.set('fullName', 'Fadumo Warsame');
      formData.set('email', 'fadumo@example.com');

      return submitCommunitySignup(null, formData).then((res) => {
        expect(res.success).toBe(true);
        expect(res.message).toContain('already part of the Naag Nool UP movement');
        expect(db.communitySignup.create).not.toHaveBeenCalled();
      });
    });

    test('rejects invalid email address', () => {
      const formData = new FormData();
      formData.set('fullName', 'Ayan');
      formData.set('email', 'not-an-email');

      return submitCommunitySignup(null, formData).then((res) => {
        expect(res.success).toBe(false);
        expect(res.error).toBeDefined();
        expect(db.communitySignup.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('submitContactInquiry', () => {
    test('successfully processes contact inquiry submission', () => {
      (db.contactSubmission.create as jest.Mock).mockResolvedValue({
        id: 'sub-1',
        name: 'Hodan Ali',
        email: 'hodan@example.com',
        subject: 'Journal question',
        message: 'I would like to inquire about the journal editions.',
        status: 'UNREAD',
      });

      const formData = new FormData();
      formData.set('name', 'Hodan Ali');
      formData.set('email', 'hodan@example.com');
      formData.set('subject', 'Journal question');
      formData.set('message', 'I would like to inquire about the journal editions.');

      return submitContactInquiry(null, formData).then((res) => {
        expect(res.success).toBe(true);
        expect(res.message).toContain('Thank you for reaching out');
        expect(db.contactSubmission.create).toHaveBeenCalled();
      });
    });

    test('fails on missing required message content', () => {
      const formData = new FormData();
      formData.set('name', 'Hodan Ali');
      formData.set('email', 'hodan@example.com');
      formData.set('subject', 'Question');
      formData.set('message', 'Too short');

      return submitContactInquiry(null, formData).then((res) => {
        expect(res.success).toBe(false);
        expect(res.error).toBeDefined();
        expect(db.contactSubmission.create).not.toHaveBeenCalled();
      });
    });
  });
});
