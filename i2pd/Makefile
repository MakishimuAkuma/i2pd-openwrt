include $(TOPDIR)/rules.mk

PKG_NAME:=i2pd
PKG_VERSION:=2.61.0
PKG_RELEASE:=2
PKG_BUILD_PARALLEL:=1
PKG_SOURCE:=$(PKG_VERSION).tar.gz
PKG_SOURCE_URL:=https://github.com/PurpleI2P/i2pd/archive/refs/tags/
PKG_SOURCE_SUBDIR:=i2pd-$(PKG_VERSION)
PKG_HASH:=409cd3c0257491286611ab6aaf690940c7248fb898377c13fadb65a836e2a0ab
PKG_MAINTAINER:=David Yang <mmyangfl@gmail.com>
PKG_LICENSE:=BSD-3-Clause
PKG_LICENSE_FILES:=LICENSE
PKG_CPE_ID:=cpe:/a:i2pd:i2pd
PKG_BUILD_DEPENDS:=boost

include $(INCLUDE_DIR)/package.mk

define Package/i2pd
  SECTION:=net
  CATEGORY:=Network
  DEPENDS:=+libopenssl +boost +boost-program_options +libatomic +zlib
  TITLE:=full-featured C++ implementation of I2P client
  URL:=https://github.com/PurpleI2P/i2pd
  USERID:=i2pd:i2pd
endef

define Package/i2pd/description
  I2P (Invisible Internet Protocol) is a universal anonymous network layer.
endef

TARGET_LDFLAGS += -latomic

define Package/i2pd/conffiles
/etc/config/i2pd
/etc/i2pd/tunnels.d/*
endef

define Package/i2pd/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/i2pd $(1)/usr/bin
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/i2pd.init $(1)/etc/init.d/i2pd
	$(INSTALL_DIR) $(1)/usr/share/i2pd
	$(CP) $(PKG_BUILD_DIR)/contrib/certificates $(1)/usr/share/i2pd/
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./files/i2pd.config $(1)/etc/config/i2pd
	$(INSTALL_DIR) $(1)/etc/i2pd/tunnels.d
	$(INSTALL_DATA) $(PKG_BUILD_DIR)/contrib/tunnels.d/README $(1)/etc/i2pd/tunnels.d/
	$(INSTALL_DIR) $(1)/usr/libexec/i2pd
	$(INSTALL_BIN) ./files/generate-config $(1)/usr/libexec/i2pd/generate-config
endef

$(eval $(call BuildPackage,i2pd))
